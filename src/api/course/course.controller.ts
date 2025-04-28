import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { CourseService } from "./course.service"
import { Public } from "@/common/decorators/public.decorator"
import type { Pagination } from "nestjs-typeorm-paginate"
import type { Course } from "@/entity/course.entity"
import type { IPaginationMeta } from "@/common/interfaces/common.interface"

@Controller("courses")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Public()
  @Get()
  async getAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Course, IPaginationMeta>> {
    return this.courseService.findAll({ page, limit })
  }

  @Public()
  @Get(":slug")
  async getOne(@Param("slug") slug: string) {
    return this.courseService.fineOne(slug)
  }
}
