import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { LearningService } from "./learning.service"
import { ClerkAuthGuard } from "@/common/guards/clerk.guard"
import { User } from "@/common/decorators/user.decorator"
import type { PublicMetadata } from "@/common/interfaces/common.interface"

@Controller("learning")
@UseGuards(ClerkAuthGuard)
export class LearningController {
  constructor(private readonly learningService: LearningService) {}
  @Get(":slug")
  async getOne(@Param("slug") courseSlug: string, @Query("lesson_id") lessonId: number, @User() user: PublicMetadata) {
    console.log({ user })
    return this.learningService.fineOne(courseSlug, lessonId, user.db_user_id)
  }
}
