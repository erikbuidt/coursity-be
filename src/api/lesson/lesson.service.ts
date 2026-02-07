import { Injectable } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from "@/modules/prisma/prisma.service"
import type { CreateLessonDto } from "./dto/create-lesson.dto"
import type { UpdateLessonDto } from "./dto/update-lesson.dto"
// biome-ignore lint/style/useImportType: <explanation>
import { FileService } from "../file/file.service"
// biome-ignore lint/style/useImportType: <explanation>
import { FFmpegService } from "@/modules/ffmpeg/ffmpeg.service"
import type { BulkUpdateLessonDto } from "./dto/bulk-update-lesson.dto"
import { AppException } from "@/common/errors/exception.error"
import { APP_ERROR } from "@/common/errors/app.error"
// biome-ignore lint/style/useImportType: <explanation>
import { ConfigService } from "@nestjs/config"
import type { lessons } from "../../generated/prisma/client"

@Injectable()
export class LessonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
    private readonly ffmpegService: FFmpegService,
    private readonly configService: ConfigService,
  ) {}

  async fineOne(lessonId: number) {
    return this.prisma.lessons.findFirst({
      where: { id: lessonId, deleted_at: null },
      select: {
        id: true,
        title: true,
        duration: true,
        image_url: true,
        video_provider: true,
        chapter_id: true,
      },
    })
  }

  async getCompletedLessons(userId: number, courseId: number) {
    return this.prisma.lesson_complete.findMany({
      where: { user_id: userId, course_id: courseId, deleted_at: null },
      select: { lesson_id: true },
    })
  }

  async create(dto: CreateLessonDto, file?: Express.Multer.File) {
    const chapter = await this.prisma.chapters.findFirst({
      where: { id: dto.chapter_id, deleted_at: null },
      include: { courses: true },
    })
    if (!chapter) throw new AppException(APP_ERROR.CHAPTER_NOT_FOUND)

    const newLessonCount = chapter.chapter_lesson_count + 1

    // Update chapter lesson count
    await this.prisma.chapters.update({
      where: { id: chapter.id },
      data: { chapter_lesson_count: newLessonCount },
    })

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const lessonData: any = {
      ...dto,
      position: newLessonCount,
    }

    if (file && chapter.courses) {
      const fileInfo = await this.fileService.create(
        {
          sub_bucket: `courses/${chapter.courses.slug}`,
          is_public: false,
        },
        file,
      )
      const duration = await this.ffmpegService.getDuration(file)
      const nodeEnv = this.configService.get<string>("NODE_ENV")
      const host = nodeEnv === "development" ? "http://localhost:4000" : "https://api.coursity.io.vn"
      lessonData.video_url = `${host}/api/v1/files/video/${fileInfo.filename}`
      lessonData.duration = duration
    }

    return this.prisma.lessons.create({ data: lessonData })
  }

  async update(id: number, dto: UpdateLessonDto, file?: Express.Multer.File) {
    const lesson = await this.prisma.lessons.findFirst({
      where: { id, deleted_at: null },
      include: { chapters: { include: { courses: true } } },
    })
    if (!lesson) throw new AppException(APP_ERROR.LESSON_NOT_FOUND)
    if (!lesson.chapters || !lesson.chapters.courses) throw new Error("Chapter or Course not found for the lesson")

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const updateData: any = { ...dto }

    if (file) {
      const fileInfo = await this.fileService.create(
        {
          sub_bucket: `courses/${lesson.chapters.courses.slug}`,
          is_public: false,
        },
        file,
      )
      const duration = await this.ffmpegService.getDuration(file)
      const nodeEnv = this.configService.get<string>("NODE_ENV")
      const host = nodeEnv === "development" ? "http://localhost:4000" : "https://api.coursity.io.vn"
      updateData.video_url = `${host}/api/v1/files/video/${fileInfo.filename}`
      updateData.duration = duration
    }

    return this.prisma.lessons.update({
      where: { id },
      data: updateData,
    })
  }

  async updateVideoInfo(id: number, video_url: string, duration: number, video_provider: string) {
    return this.update(id, { video_url, duration, video_provider })
  }

  async uploadVideo(lessonId: number, file: Express.Multer.File) {
    const lesson = await this.prisma.lessons.findFirst({
      where: { id: lessonId, deleted_at: null },
      include: { chapters: { include: { courses: true } } },
    })
    if (!lesson) throw new Error("Lesson not found")
    if (!lesson.chapters || !lesson.chapters.courses) throw new Error("Chapter or Course not found for the lesson")

    const fileInfo = await this.fileService.create(
      {
        sub_bucket: `courses/${lesson.chapters.courses.slug}`,
        is_public: false,
      },
      file,
    )
    const duration = await this.ffmpegService.getDuration(file)
    const videoUrl = `https://api.coursity.io.vn/api/v1/files/video/${fileInfo.filename}`

    await this.prisma.lessons.update({
      where: { id: lessonId },
      data: { video_url: videoUrl, duration },
    })

    return {
      lessonId,
      video_url: videoUrl,
      duration: 0,
      video_provider: "system",
    }
  }

  async updateLessonPositions(bulkUpdateLessonDto: BulkUpdateLessonDto) {
    const results: lessons[] = []
    for (const lesson of bulkUpdateLessonDto.lessons) {
      const { id, ...updateDto } = lesson
      const updated = await this.update(id, updateDto)
      results.push(updated)
    }
    return results
  }

  async remove(lessonId: number, userId: number) {
    const lesson = await this.prisma.lessons.findFirst({ where: { id: lessonId, deleted_at: null } })
    if (!lesson) {
      throw new AppException(APP_ERROR.LESSON_NOT_FOUND)
    }

    // Soft delete the lesson
    await this.prisma.lessons.update({
      where: { id: lessonId },
      data: { deleted_at: new Date(), deleted_by: userId.toString() },
    })

    // Update the chapter's lesson count
    const lessonCount = await this.prisma.lessons.count({
      where: { chapter_id: lesson.chapter_id, deleted_at: null },
    })

    await this.prisma.chapters.update({
      where: { id: lesson.chapter_id },
      data: { chapter_lesson_count: lessonCount },
    })

    return { lesson_id: lessonId }
  }
}
