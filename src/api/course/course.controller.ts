import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { CourseService } from "./course.service"
import { Public } from "@/common/decorators/public.decorator"
import type { Pagination } from "nestjs-typeorm-paginate"
import type { Course } from "@/entity/course.entity"
import type { IPaginationMeta, PublicMetadata } from "@/common/interfaces/common.interface"
import { User } from "@/common/decorators/user.decorator"
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateCourseDto } from "./dto/update-course.dto"
// biome-ignore lint/style/useImportType: <explanation>
import { CreateCourseDto } from "./dto/create-course.dto"
import { FileInterceptor } from "@nestjs/platform-express"

@Controller("courses")
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("thumbnail", {
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|jpg)$/)) {
          return cb(new Error("Only image files are allowed"), false)
        }
        cb(null, true)
      },
    }),
  )
  async create(@Body() createCourseDto: CreateCourseDto, @UploadedFile() file: Express.Multer.File, @User() user: PublicMetadata) {
    return this.courseService.create(createCourseDto, file, user?.db_user_id)
  }

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

  @Put(":slug")
  @UseInterceptors(
    FileInterceptor("thumbnail", {
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|jpg)$/)) {
          return cb(new Error("Only image files are allowed"), false)
        }
        cb(null, true)
      },
    }),
  )
  async update(
    @Param("slug") slug: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: PublicMetadata,
  ) {
    return this.courseService.update(slug, updateCourseDto, file, user?.db_user_id)
  }

  @Get(":slug/progress")
  async getCourseProgress(@Param("slug") slug: string, @User() user: PublicMetadata) {
    return this.courseService.getCourseProgress(slug, user?.db_user_id)
  }
}
