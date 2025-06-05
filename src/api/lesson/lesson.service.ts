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

  async create(dto: CreateLessonDto) {
    const chapter = await this.lessonRepository.manager.findOne(Lesson, { where: { id: dto.chapter_id } })
    if (!chapter) throw new Error("Chapter not found")
    const lesson = this.lessonRepository.create(dto)
    return this.lessonRepository.save(lesson)
  }

  async update(id: number, dto: UpdateLessonDto) {
    const lesson = await this.lessonRepository.findOne({ where: { id } })
    if (!lesson) throw new Error("Lesson not found")
    Object.assign(lesson, dto)
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
    lesson.video_url = `http://localhost:4000/api/v1/files/video/${fileInfo.filename}`
    lesson.duration = duration // Assuming file.filename is the uploaded video URL
    await this.lessonRepository.save(lesson)
    return {
      lessonId,
      video_url: `http://localhost:4000/api/v1/files/video/${fileInfo.filename}`, // Assuming file.filename is the uploaded video URL
      duration: 0, // Placeholder for duration, should be calculated
      video_provider: "system", // Placeholder for video provider
    }
  }
}
