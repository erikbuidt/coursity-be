import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { LessonService } from "./lesson.service"
// biome-ignore lint/style/useImportType: <explanation>
import { LearningService } from "../learning/learning.service"
import type { PublicMetadata } from "@/common/interfaces/common.interface"
import { User } from "@/common/decorators/user.decorator"
import { ClerkAuthGuard } from "@/common/guards/clerk.guard"

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
}
