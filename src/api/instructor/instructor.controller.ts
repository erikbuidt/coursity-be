import { COURSE_STATUS } from "@/common/constant/app.constant"
import { Public } from "@/common/decorators/public.decorator"
import type { IPaginationMeta, PublicMetadata } from "@/common/interfaces/common.interface"
import type { Course } from "@/entity/course.entity"
import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from "@nestjs/common"
import type { Pagination } from "nestjs-typeorm-paginate"
// biome-ignore lint/style/useImportType: <explanation>
import { CourseService } from "../course/course.service"
import { User } from "@/common/decorators/user.decorator"

@Controller("instructor")
export class InstructorController {
  constructor(private readonly courseService: CourseService) {}

  @Get("taught-courses")
  async getInstructorCourses(
    @User() user: PublicMetadata,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(8), ParseIntPipe) limit: number = 8,
    @Query("search", new DefaultValuePipe("")) search: string = "",
  ): Promise<Pagination<Course & { lesson_count: number }, IPaginationMeta>> {
    return this.courseService.findAll(
      { page, limit, status: [COURSE_STATUS.PUBLISHED, COURSE_STATUS.IN_REVIEW, COURSE_STATUS.DRAFT, COURSE_STATUS.REJECTED] },
      search,
      user,
    )
  }
}
