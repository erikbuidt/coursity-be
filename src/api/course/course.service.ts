import { Injectable } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from "@/modules/prisma/prisma.service"
import { generateNameId, toSnakeCaseMeta } from "@/common/utils/app.util"
import type { IPaginationMeta, PublicMetadata } from "@/common/interfaces/common.interface"
import { AppException } from "@/common/errors/exception.error"
import { APP_ERROR } from "@/common/errors/app.error"
// biome-ignore lint/style/useImportType: <explanation>
import { CreateCourseDto } from "./dto/create-course.dto"
// biome-ignore lint/style/useImportType: <explanation>
import { FileService } from "../file/file.service"
// biome-ignore lint/style/useImportType: <explanation>
import { ConfigService } from "@nestjs/config"
import { v4 as uuidv4 } from "uuid"
import { COURSE_STATUS } from "@/common/constant/app.constant"
import type { courses } from "../../generated/prisma/client"

interface PaginationOptions {
  page?: number
  limit?: number
  status?: COURSE_STATUS[]
}

interface PaginatedResult<T> {
  items: T[]
  meta: IPaginationMeta
}

@Injectable()
export class CourseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(
    options: PaginationOptions,
    search?: string,
    user?: PublicMetadata,
  ): Promise<PaginatedResult<courses & { lesson_count: number; instructor_email?: string }>> {
    const page = options.page ?? 1
    const limit = options.limit ?? 10
    const skip = (page - 1) * limit

    // Build where clause
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const where: any = { deleted_at: null }

    if (options.status && options.status.length > 0) {
      where.status = { in: options.status }
    } else {
      where.status = { not: COURSE_STATUS.DRAFT }
    }

    if (user?.db_user_id) {
      where.instructor_id = user.db_user_id
    }

    if (search) {
      where.title = { contains: search, mode: "insensitive" }
    }

    // Get courses with aggregations
    const [courses, total] = await Promise.all([
      this.prisma.courses.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          users: { select: { email: true } },
          chapters: {
            include: {
              lessons: { select: { id: true, duration: true } },
            },
          },
        },
      }),
      this.prisma.courses.count({ where }),
    ])

    const items = courses.map((course) => {
      const lessonCount = course.chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0)
      const duration = course.chapters.reduce(
        (acc, chapter) => acc + chapter.lessons.reduce((sum, lesson) => sum + Number(lesson.duration ?? 0), 0),
        0,
      )
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price,
        discount_price: course.discount_price,
        slug: course.slug,
        image_url: course.image_url,
        status: course.status,
        instructor_email: course.users?.email,
        lesson_count: lessonCount,
        duration,
      }
    })

    const totalPages = Math.ceil(total / limit)

    return {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      items: items as any,
      meta: {
        total_items: total,
        item_count: items.length,
        items_per_page: limit,
        total_pages: totalPages,
        current_page: page,
      },
    }
  }

  async fineOne(slug: string, userId?: number): Promise<courses & { duration: number; lesson_count: number; is_enrolled: boolean }> {
    const course = await this.prisma.courses.findFirst({
      where: { slug, deleted_at: null },
      include: {
        chapters: {
          where: { deleted_at: null },
          orderBy: { position: "asc" },
          include: {
            lessons: {
              where: { deleted_at: null },
              orderBy: { position: "asc" },
              select: {
                id: true,
                title: true,
                duration: true,
                image_url: true,
                video_provider: true,
                video_url: true,
                position: true,
                chapter_id: true,
              },
            },
          },
        },
      },
    })

    if (!course) throw new AppException(APP_ERROR.COURSE_NOT_FOUND)

    // Calculate lesson count and duration
    let lessonCount = 0
    let totalDuration = 0
    for (const chapter of course.chapters) {
      lessonCount += chapter.lessons.length
      for (const lesson of chapter.lessons) {
        totalDuration += Number(lesson.duration ?? 0)
      }
    }

    // Check enrollment if userId is provided
    let isEnrolled = false
    if (userId) {
      const enrollment = await this.prisma.enrollments.findFirst({
        where: {
          user_id: userId,
          course_id: course.id,
          deleted_at: null,
        },
      })
      isEnrolled = Boolean(enrollment)
    }

    return {
      ...course,
      duration: totalDuration,
      lesson_count: lessonCount,
      is_enrolled: isEnrolled,
    }
  }

  async create(createCourseDto: CreateCourseDto, thumbnail: Express.Multer.File, userId: number) {
    const slug = generateNameId({ name: createCourseDto.title, id: uuidv4() })
    const fileInfo = await this.fileService.create(
      {
        sub_bucket: `courses/${slug}`,
        is_public: true,
      },
      thumbnail,
    )
    const nodeEnv = this.configService.get<string>("NODE_ENV")
    const host = nodeEnv === "development" ? "http://localhost:4000" : "https://api.coursity.io.vn"

    const newCourse = await this.prisma.courses.create({
      data: {
        title: createCourseDto.title,
        description: createCourseDto.description,
        price: createCourseDto.price,
        category: createCourseDto.category,
        slug: slug,
        image_url: `${host}/api/v1/files/${fileInfo.filename}`,
        instructor_id: userId,
        updated_by: userId?.toString() ?? "admin",
        created_by: userId?.toString() ?? "admin",
      },
    })
    return newCourse
  }

  async update(
    slug: string,
    dto: Record<string, unknown>,
    thumbnail: Express.Multer.File | undefined,
    promotionVideo: Express.Multer.File | undefined,
    userId: number,
  ) {
    console.log({ promotionVideo })
    const course = await this.prisma.courses.findFirst({ where: { slug, deleted_at: null } })
    if (!course) throw new AppException(APP_ERROR.COURSE_NOT_FOUND)

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const updateData: any = { ...dto }

    if (thumbnail) {
      const nodeEnv = this.configService.get<string>("NODE_ENV")
      const host = nodeEnv === "development" ? "http://localhost:4000" : "https://api.coursity.io.vn"
      const fileInfo = await this.fileService.create(
        {
          sub_bucket: `courses/${slug}`,
          is_public: true,
        },
        thumbnail,
      )
      updateData.image_url = `${host}/api/v1/files/${fileInfo.filename}`
    }

    if (promotionVideo) {
      const nodeEnv = this.configService.get<string>("NODE_ENV")
      const host = nodeEnv === "development" ? "http://localhost:4000" : "https://api.coursity.io.vn"
      const fileInfo = await this.fileService.create(
        {
          sub_bucket: `courses/${slug}`,
          is_public: true,
        },
        promotionVideo,
      )
      updateData.promotion_video_url = `${host}/api/v1/files/${fileInfo.filename}`
    }

    updateData.updated_by = userId?.toString() ?? "admin"
    updateData.status = COURSE_STATUS.DRAFT

    return this.prisma.courses.update({
      where: { id: course.id },
      data: updateData,
    })
  }

  async getCourseProgress(slug: string, userId: number) {
    const course = await this.prisma.courses.findFirst({ where: { slug, deleted_at: null } })
    if (!course) return null

    const courseProgress = await this.prisma.course_progress.findFirst({
      where: {
        course_id: course.id,
        user_id: userId,
        deleted_at: null,
      },
    })
    return courseProgress
  }

  async submitToReview(slug: string, userId: number) {
    const course = await this.prisma.courses.findFirst({
      where: { slug, created_by: userId.toString(), deleted_at: null },
    })
    if (!course) throw new AppException(APP_ERROR.COURSE_NOT_FOUND)
    if (course.status !== COURSE_STATUS.DRAFT) {
      throw new AppException(APP_ERROR.COURSE_NOT_IN_DRAFT_STATUS)
    }

    return this.prisma.courses.update({
      where: { id: course.id },
      data: { status: COURSE_STATUS.IN_REVIEW },
    })
  }

  async getMyCourses(userId: number) {
    const myEnrollments = await this.prisma.enrollments.findMany({
      where: { user_id: userId, deleted_at: null },
      include: { courses: true },
    })

    const courseProgresses = await this.prisma.course_progress.findMany({
      where: { user_id: userId, deleted_at: null },
    })

    const myCourses = myEnrollments.map((enrollment) => {
      const course = enrollment.courses
      const courseProgress = courseProgresses.find((cp) => cp.course_id === course.id)
      return { ...course, course_progress: courseProgress }
    })

    return myCourses
  }
}
