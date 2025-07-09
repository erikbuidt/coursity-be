import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common"
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
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express"
import { COURSE_STATUS } from "@/common/constant/app.constant"

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
  async getPublishedCourses(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query("limit", new DefaultValuePipe(8), ParseIntPipe) limit: number = 8,
    @Query("search", new DefaultValuePipe("")) search: string = "",
  ): Promise<Pagination<Course & { lesson_count: number }, IPaginationMeta>> {
    return this.courseService.findAll({ page, limit, status: COURSE_STATUS.PUBLISHED }, search)
  }

  @Get("/all")
  async getAllCourses(
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
    FileFieldsInterceptor(
      [
        {
          name: "thumbnail",
          maxCount: 1,
        },
        {
          name: "promotion_video",
          maxCount: 1,
        },
      ],
      {
        limits: {
          fileSize: 1024 * 1024 * 20, // 20MB max for any file
        },
        fileFilter: (req, file, cb) => {
          if (
            (file.fieldname === "thumbnail" && !file.mimetype.match(/^image\/(jpeg|png|jpg)$/)) ||
            (file.fieldname === "promotion_video" && !file.mimetype.match(/^video\/(mp4)$/))
          ) {
            return cb(new Error("Invalid file type"), false)
          }
          cb(null, true)
        },
      },
    ),
  )
  async update(
    @Param("slug") slug: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFiles() files: { thumbnail?: Express.Multer.File[]; promotion_video?: Express.Multer.File[] },
    @User() user: PublicMetadata,
  ) {
    const thumbnail = files.thumbnail?.[0]
    const promotionVideo = files.promotion_video?.[0]
    return this.courseService.update(slug, updateCourseDto, thumbnail, promotionVideo, user?.db_user_id)
  }

  @Get(":slug/progress")
  async getCourseProgress(@Param("slug") slug: string, @User() user: PublicMetadata) {
    return this.courseService.getCourseProgress(slug, user?.db_user_id)
  }

  @Post(":slug/submit-to-review")
  async submitToReview(@Param("slug") slug: string, @User() user: PublicMetadata) {
    return this.courseService.submitToReview(slug, user?.db_user_id)
  }
}
