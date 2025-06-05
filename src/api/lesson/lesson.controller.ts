import { Public } from "@/common/decorators/public.decorator"
import { User } from "@/common/decorators/user.decorator"
import type { PublicMetadata } from "@/common/interfaces/common.interface"
import { Body, Controller, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
// biome-ignore lint/style/useImportType: <explanation>
import { LearningService } from "../learning/learning.service"
import type { CreateLessonDto } from "./dto/create-lesson.dto"
import type { UpdateLessonDto } from "./dto/update-lesson.dto"
// biome-ignore lint/style/useImportType: <explanation>
import { LessonService } from "./lesson.service"

@Controller("lessons")
export class LessonController {
  constructor(
    private readonly lessonService: LessonService,
    private readonly learningService: LearningService,
  ) {}

  @Get()
  async getOne(@Query("id") id: number) {
    return this.lessonService.fineOne(id)
  }

  @Get("complete")
  async getCompletedLessons(@User() user: PublicMetadata, @Query("course_id") courseId: number) {
    return this.lessonService.getCompletedLessons(user.db_user_id, courseId)
  }

  @Post(":lessonId/complete")
  async completeLesson(
    @Param("lessonId") lessonId: number,
    @Body() { course_id: courseId, chapter_id: chapterId }: { course_id: number; chapter_id: number },
    @User() user: PublicMetadata,
  ) {
    return this.learningService.completeLesson(user.db_user_id, courseId, chapterId, +lessonId)
  }

  @Post()
  @Public()
  async createLesson(@Body() dto: CreateLessonDto) {
    return this.lessonService.create(dto)
  }

  @Put(":id")
  @Public()
  async updateLesson(@Param("id") id: number, @Body() dto: UpdateLessonDto) {
    return this.lessonService.update(id, dto)
  }

  @Post(":lessonId/video")
  @Public()
  @UseInterceptors(FileInterceptor("file"))
  async uploadLessonVideo(@Param("lessonId") lessonId: number, @UploadedFile() file: Express.Multer.File) {
    return this.lessonService.uploadVideo(lessonId, file)
  }
}
