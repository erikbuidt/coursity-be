import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { CourseService } from "./course.service"
import { Public } from "@/common/decorators/public.decorator"
import type { Pagination } from "nestjs-typeorm-paginate"
import type { Course } from "@/entity/course.entity"
import type { IPaginationMeta, PublicMetadata } from "@/common/interfaces/common.interface"
import { User } from "@/common/decorators/user.decorator"

@Controller("courses")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Public()
  @Get()
  async getAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(8), ParseIntPipe) limit: number = 8,
    @Query("search", new DefaultValuePipe("")) search: string = "",
  ): Promise<Pagination<Course & { lesson_count: number }, IPaginationMeta>> {
    return this.courseService.findAll({ page, limit }, search)
  }

  @Get(":slug")
  @Public()
  async getOne(@Param("slug") slug: string, @User() user: PublicMetadata) {
    return this.courseService.fineOne(slug, user?.db_user_id)
  }

  @Get(":slug/progress")
  @Public()
  async getCourseProgress(@Param("slug") slug: string, @User() user: PublicMetadata) {
    return this.courseService.getCourseProgress(slug, user?.db_user_id)
  }
}
