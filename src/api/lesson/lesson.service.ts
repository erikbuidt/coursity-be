import { Lesson } from "@/entity/lesson.entity"
import { LessonComplete } from "@/entity/lesson-complete.entity"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import type { CreateLessonDto } from "./dto/create-lesson.dto"
import type { UpdateLessonDto } from "./dto/update-lesson.dto"
// biome-ignore lint/style/useImportType: <explanation>
import { FileService } from "../file/file.service"
// biome-ignore lint/style/useImportType: <explanation>
import { FFmpegService } from "@/modules/ffmpeg/ffmpeg.service"
import type { BulkUpdateLessonDto } from "./dto/bulk-update-lesson.dto"
import { AppException } from "@/common/errors/exception.error"
import { APP_ERROR } from "@/common/errors/app.error"
import { Chapter } from "@/entity/chapter.entity"

@Injectable()
export class LessonService {
  constructor(
    private readonly fileService: FileService,
    private readonly ffmpegService: FFmpegService,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(LessonComplete)
    private readonly lessonCompleteRepository: Repository<LessonComplete>,
  ) {}

  async fineOne(lessonId: number) {
    return this.lessonRepository
      .createQueryBuilder("lesson")
      .where("lesson.id = :lessonId", { lessonId })
      .select(["lesson.id", "lesson.title", "lesson.duration", "lesson.image_url", "lesson.video_provider", "lesson.chapter_id"])
      .getOne()
  }

  async getCompletedLessons(userId: number, courseId: number) {
    return this.lessonCompleteRepository.find({
      where: { user_id: userId, course_id: courseId },
      select: ["lesson_id"],
    })
  }

  async create(dto: CreateLessonDto, file?: Express.Multer.File) {
    const chapter = await this.lessonRepository.manager.findOne(Chapter, { where: { id: dto.chapter_id }, relations: ["course"] })
    if (!chapter) throw new AppException(APP_ERROR.CHAPTER_NOT_FOUND)
    chapter.chapter_lesson_count += 1
    const lesson = this.lessonRepository.create({
      ...dto,
      position: chapter.chapter_lesson_count,
    })
    if (file) {
      const fileInfo = await this.fileService.create(
        {
          sub_bucket: `courses/${chapter.course.slug}`,
          is_public: false,
        },
        file,
      )
      const duration = await this.ffmpegService.getDuration(file) // Assuming you have a method to get video duration
      lesson.video_url = `https://api.coursity.io.vn//api/v1/files/video/${fileInfo.filename}`
      lesson.duration = duration // Assuming file.filename is the uploaded video URL
    }
    await this.lessonCompleteRepository.manager.save(chapter)
    return this.lessonRepository.save(lesson)
  }

  async update(id: number, dto: UpdateLessonDto, file?: Express.Multer.File) {
    const lesson = await this.lessonRepository.findOne({ where: { id }, relations: ["chapter", "chapter.course"] })
    if (!lesson) throw new AppException(APP_ERROR.LESSON_NOT_FOUND)
    if (!lesson.chapter || !lesson.chapter.course) throw new Error("Chapter or Course not found for the lesson")
    Object.assign(lesson, dto)

    // Here you would typically upload the file to your storage (e.g., Minio, S3)
    if (file) {
      const fileInfo = await this.fileService.create(
        {
          sub_bucket: `courses/${lesson.chapter.course.slug}`,
          is_public: false,
        },
        file,
      )
      const duration = await this.ffmpegService.getDuration(file) // Assuming you have a method to get video duration
      lesson.video_url = `https://api.coursity.io.vn//api/v1/files/video/${fileInfo.filename}`
      lesson.duration = duration // Assuming file.filename is the uploaded video URL
    }

    return this.lessonRepository.save(lesson)
  }

  async updateVideoInfo(id: number, video_url: string, duration: number, video_provider: string) {
    return this.update(id, { video_url, duration, video_provider })
  }

  async uploadVideo(lessonId: number, file: Express.Multer.File) {
    const lesson = await this.lessonRepository.findOne({ where: { id: lessonId }, relations: ["chapter", "chapter.course"] })
    if (!lesson) throw new Error("Lesson not found")
    if (!lesson.chapter || !lesson.chapter.course) throw new Error("Chapter or Course not found for the lesson")
    // Here you would typically upload the file to your storage (e.g., Minio, S3)

    const fileInfo = await this.fileService.create(
      {
        sub_bucket: `courses/${lesson.chapter.course.slug}`,
        is_public: false,
      },
      file,
    )
    const duration = await this.ffmpegService.getDuration(file) // Assuming you have a method to get video duration
    lesson.video_url = `https://api.coursity.io.vn//api/v1/files/video/${fileInfo.filename}`
    lesson.duration = duration // Assuming file.filename is the uploaded video URL
    await this.lessonRepository.save(lesson)
    return {
      lessonId,
      video_url: `https://api.coursity.io.vn//api/v1/files/video/${fileInfo.filename}`, // Assuming file.filename is the uploaded video URL
      duration: 0, // Placeholder for duration, should be calculated
      video_provider: "system", // Placeholder for video provider
    }
  }

  async updateLessonPositions(bulkUpdateLessonDto: BulkUpdateLessonDto) {
    const results: Lesson[] = []
    for (const lesson of bulkUpdateLessonDto.lessons) {
      const { id, ...updateDto } = lesson
      const updated = await this.update(id, updateDto)
      results.push(updated)
    }
    return results
  }

  async remove(lessonId: number, userId: number) {
    // Find the lesson to ensure it exists
    const lesson = await this.lessonRepository.findOne({ where: { id: lessonId } })
    if (!lesson) {
      throw new AppException(APP_ERROR.LESSON_NOT_FOUND)
    }

    // Soft delete the lesson
    const updateResult = await this.lessonRepository.softDelete(lessonId)

    if (updateResult.affected === 0) {
      throw new AppException(APP_ERROR.LESSON_NOT_FOUND)
    }

    // Update the chapter's lesson count
    const lessonCount = await this.lessonRepository.count({
      where: { chapter_id: lesson.chapter_id },
    })

    await this.lessonRepository.manager.update(Chapter, lesson.chapter_id, {
      chapter_lesson_count: lessonCount,
    })

    // Return the deleted lesson ID
    return { lesson_id: lessonId }
  }
}
