import { COURSE_STATUS } from "@/common/constant/app.constant"
import type { IPaginationMeta, PublicMetadata } from "@/common/interfaces/common.interface"
import type { courses } from "../../generated/prisma/client"
import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { CourseService } from "../course/course.service"
import { User } from "@/common/decorators/user.decorator"

interface PaginatedResult<T> {
  items: T[]
  meta: IPaginationMeta
}

@Controller("instructor")
export class InstructorController {
  constructor(private readonly courseService: CourseService) {}

  @Get("taught-courses")
  async getInstructorCourses(
    @User() user: PublicMetadata,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(8), ParseIntPipe) limit = 8,
    @Query("search", new DefaultValuePipe("")) search = "",
  ): Promise<PaginatedResult<courses & { lesson_count: number }>> {
    return this.courseService.findAll(
      { page, limit, status: [COURSE_STATUS.PUBLISHED, COURSE_STATUS.IN_REVIEW, COURSE_STATUS.DRAFT, COURSE_STATUS.REJECTED] },
      search,
      user,
    )
  }
}
