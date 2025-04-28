import { Controller, Get, Query } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { LessonService } from "./lesson.service"

@Controller("lessons")
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Get()
  async getOne(@Query("id") id: number) {
    return this.lessonService.fineOne(id)
  }
}
