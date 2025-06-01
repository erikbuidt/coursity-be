import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { ChapterService } from "./chapter.service"
import type { CreateChapterDto } from "./dto/create-chapter.dto"
import type { UpdateChapterDto } from "./dto/update-chapter.dto"
import { ClerkAuthGuard } from "@/common/guards/clerk.guard"
import { Public } from "@/common/decorators/public.decorator"
import { ApiTags } from "@nestjs/swagger"

@ApiTags("chapters")
@Controller("chapters")
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Get()
  @Public()
  async findAll() {
    return this.chapterService.findAll()
  }

  @Get("completed")
  async getCompletedChapters(
    @Query("user_id", ParseIntPipe) userId: number,
    @Query("course_id", ParseIntPipe) courseId: number,
  ) {
    return this.chapterService.getCompletedChapters(userId, courseId)
  }

  @Get("course/:courseId")
  @Public()
  async findByCourseId(@Param("courseId", ParseIntPipe) courseId: number) {
    return this.chapterService.findByCourseId(courseId)
  }

  @Get(":id")
  @Public()
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.chapterService.findOne(id)
  }

  @Post()
  async create(@Body() createChapterDto: CreateChapterDto) {
    return this.chapterService.create(createChapterDto)
  }

  @Put(":id")
  async update(@Param("id", ParseIntPipe) id: number, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chapterService.update(id, updateChapterDto)
  }

  @Delete(":id")
  @UseGuards(ClerkAuthGuard)
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.chapterService.remove(id)
  }
}
