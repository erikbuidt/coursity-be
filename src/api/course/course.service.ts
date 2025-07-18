import { Course } from "@/entity/course.entity"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from "typeorm"
import { type IPaginationOptions, paginate, paginateRaw, type Pagination } from "nestjs-typeorm-paginate"
import { generateNameId, toSnakeCaseMeta } from "@/common/utils/app.util"
import type { IPaginationMeta, PublicMetadata } from "@/common/interfaces/common.interface"
import { Enrollment } from "@/entity/enrollment.entity"
import { AppException } from "@/common/errors/exception.error"
import { APP_ERROR } from "@/common/errors/app.error"
import { CourseProgress } from "@/entity/course-progress.entity"
// biome-ignore lint/style/useImportType: <explanation>
import { CreateCourseDto } from "./dto/create-course.dto"
// biome-ignore lint/style/useImportType: <explanation>
import { FileService } from "../file/file.service"
// biome-ignore lint/style/useImportType: <explanation>
import { ConfigService } from "@nestjs/config"
import { v4 as uuidv4 } from "uuid"
import { COURSE_STATUS } from "@/common/constant/app.constant"

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(CourseProgress)
    private readonly courseProgressRepository: Repository<CourseProgress>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    private readonly fileService: FileService,
    private readonly configService: ConfigService,
  ) {}
  async findAll(
    options: IPaginationOptions & { status?: COURSE_STATUS[] },
    search?: string,
    user?: PublicMetadata,
  ): Promise<Pagination<Course & { lesson_count: number }, IPaginationMeta>> {
    const queryBuilder = this.courseRepository
      .createQueryBuilder("course")
      .leftJoin("course.chapters", "chapter")
      .leftJoin("chapter.lessons", "lesson")
      .leftJoin("course.instructor", "instructor")
      .select([
        "course.id AS id",
        "course.title AS title",
        "course.description AS description",
        "course.price AS price",
        "course.discount_price AS discount_price",
        "course.slug AS slug",
        "course.image_url AS image_url",
        "course.status AS status",
        "instructor.email AS instructor_email",
        "COUNT(lesson.id) AS lesson_count",
        "SUM(lesson.duration) duration",
      ])
      .groupBy("course.id")
      .addGroupBy("instructor.email")
      .orderBy("course.created_at", "DESC")
    if (options.status && options.status.length > 0) {
      queryBuilder.andWhere("course.status IN (:...status)", { status: options.status })
    } else {
      queryBuilder.andWhere("course.status != :status", { status: COURSE_STATUS.DRAFT })
    }
    if (user?.db_user_id) {
      queryBuilder.andWhere("course.instructor_id = :instructor_id", { instructor_id: user.db_user_id })
    }
    if (search) {
      queryBuilder.andWhere("course.title ILIKE :search", {
        search: `%${search}%`,
      })
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const rawPagination = await paginateRaw<Course & { lesson_count: number; instructor_email: string }>(queryBuilder as any, options)
    return {
      items: rawPagination.items.map((item) => ({
        ...item,
        lesson_count: Number(item.lesson_count),
        instructor_email: item.instructor_email,
      })),
      meta: toSnakeCaseMeta(rawPagination.meta),
    }
  }
  async fineOne(slug: string, userId?: number): Promise<Course & { duration: number; lesson_count: number; is_enrolled: boolean }> {
    const course = await this.courseRepository
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.chapters", "chapter")
      .leftJoinAndSelect("chapter.lessons", "lesson")
      .where("course.slug = :slug", { slug })
      .select([
        "course.id",
        "course.title",
        "course.description",
        "course.price",
        "course.slug",
        "course.status",
        "course.image_url",
        "course.promotion_video_url",
        "course.discount_price",
        "course.will_learns",
        "course.requirements",
        "chapter.id",
        "chapter.title",
        "chapter.position",
        "lesson.id",
        "lesson.title",
        "lesson.duration",
        "lesson.image_url",
        "lesson.video_provider",
        "lesson.video_url",
        "lesson.position",
        "lesson.chapter_id",
      ])
      .orderBy("chapter.position", "ASC")
      .addOrderBy("lesson.position", "ASC")
      .getOne()
    const countAndSum = await this.courseRepository
      .createQueryBuilder("course")
      .leftJoin("course.chapters", "chapter")
      .leftJoin("chapter.lessons", "lesson")
      .where("course.slug = :slug", { slug })
      .select(["COUNT(lesson.id) AS lesson_count", "SUM(lesson.duration) duration"])
      .groupBy("course.id")
      .getRawOne()

    let enrollment: Enrollment | null = null
    if (!course) throw new AppException(APP_ERROR.COURSE_NOT_FOUND)
    if (userId) {
      enrollment = await this.enrollmentRepository.findOne({
        where: {
          user_id: userId,
          course_id: course.id,
        },
      })
    }
    return {
      ...course,
      duration: countAndSum.duration,
      lesson_count: countAndSum.lesson_count,
      is_enrolled: Boolean(enrollment),
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
    const newCourse = this.courseRepository.create({
      title: createCourseDto.title,
      description: createCourseDto.description,
      price: createCourseDto.price,
      category: createCourseDto.category,
      slug: slug,
      image_url: `${host}/api/v1/files/${fileInfo.filename}`,
      instructor: { id: userId },
      updated_by: userId?.toString() || "admin",
      created_by: userId?.toString() || "admin",
    })
    return this.courseRepository.save(newCourse)
  }
  async update(
    slug: string,
    dto: Partial<Course>,
    thumbnail: Express.Multer.File | undefined,
    promotionVideo: Express.Multer.File | undefined,
    userId: number,
  ) {
    console.log({ promotionVideo })
    const course = await this.courseRepository.findOne({ where: { slug } })
    if (!course) throw new AppException(APP_ERROR.COURSE_NOT_FOUND)
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
      dto.image_url = `${host}/api/v1/files/${fileInfo.filename}`
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
      dto.promotion_video_url = `${host}/api/v1/files/${fileInfo.filename}`
    }
    dto.updated_by = userId?.toString() || "admin"
    Object.assign(course, dto)
    course.status = COURSE_STATUS.DRAFT
    return this.courseRepository.save(course)
  }

  async getCourseProgress(slug: string, userId: number) {
    const courseProgress = await this.courseProgressRepository.findOne({
      where: {
        course: {
          slug,
        },
        user_id: userId,
      },
    })
    return courseProgress
  }

  async submitToReview(slug: string, userId: number) {
    const course = await this.courseRepository.findOne({ where: { slug, created_by: userId.toString() } })
    if (!course) throw new AppException(APP_ERROR.COURSE_NOT_FOUND)
    if (course.status !== COURSE_STATUS.DRAFT) {
      throw new AppException(APP_ERROR.COURSE_NOT_IN_DRAFT_STATUS)
    }
    course.status = COURSE_STATUS.IN_REVIEW
    return this.courseRepository.save(course)
  }
}
