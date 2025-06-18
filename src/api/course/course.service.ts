import { Course } from "@/entity/course.entity"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from "typeorm"
import { type IPaginationOptions, paginate, paginateRaw, type Pagination } from "nestjs-typeorm-paginate"
import { toSnakeCaseMeta } from "@/common/utils/app.util"
import type { IPaginationMeta } from "@/common/interfaces/common.interface"
import { Enrollment } from "@/entity/enrollment.entity"
import { AppException } from "@/common/errors/exception.error"
import { APP_ERROR } from "@/common/errors/app.error"
import { CourseProgress } from "@/entity/course-progress.entity"
// biome-ignore lint/style/useImportType: <explanation>
import { CreateCourseDto } from "./dto/create-course.dto"
// biome-ignore lint/style/useImportType: <explanation>
import { FileService } from "../file/file.service"
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
  ) {}
  async findAll(options: IPaginationOptions, search?: string): Promise<Pagination<Course & { lesson_count: number }, IPaginationMeta>> {
    const queryBuilder = this.courseRepository
      .createQueryBuilder("course")
      .leftJoin("course.chapters", "chapter")
      .leftJoin("chapter.lessons", "lesson")
      .select([
        "course.id AS id",
        "course.title AS title",
        "course.description AS description",
        "course.price AS price",
        "course.discount_price AS discount_price",
        "course.slug AS slug",
        "course.image_url AS image_url",
        "COUNT(lesson.id) AS lesson_count",
        "SUM(lesson.duration) duration",
      ])
      .groupBy("course.id")
      .orderBy("course.created_at", "DESC")

    if (search) {
      queryBuilder.where("course.title ILIKE :search", {
        search: `%${search}%`,
      })
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const rawPagination = await paginateRaw<Course & { lesson_count: number }>(queryBuilder as any, options)

    return {
      items: rawPagination.items.map((item) => ({
        ...item,
        lesson_count: Number(item.lesson_count),
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
        "course.image_url",
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
    const slug = createCourseDto.title.replace(/\s+/g, "-").toLowerCase()
    const fileInfo = await this.fileService.create(
      {
        sub_bucket: `courses/${slug}`,
        is_public: true,
      },
      thumbnail,
    )
    const newCourse = this.courseRepository.create({
      title: createCourseDto.title,
      description: createCourseDto.description,
      price: createCourseDto.price,
      category: createCourseDto.category,
      slug: slug,
      image_url: `https://api.coursity.io.vn//api/v1/files/${fileInfo.filename}`,
      updated_by: userId?.toString() || "admin",
      created_by: userId?.toString() || "admin",
    })
    return this.courseRepository.save(newCourse)
  }
  async update(slug: string, dto: Partial<Course>, thumbnail: Express.Multer.File, userId: number) {
    const course = await this.courseRepository.findOne({ where: { slug } })
    if (!course) throw new AppException(APP_ERROR.COURSE_NOT_FOUND)
    if (thumbnail) {
      const fileInfo = await this.fileService.create(
        {
          sub_bucket: `courses/${slug}`,
          is_public: true,
        },
        thumbnail,
      )
      dto.image_url = `https://api.coursity.io.vn//api/v1/files/${fileInfo.filename}`
    }
    dto.updated_by = userId?.toString() || "admin"
    Object.assign(course, dto)
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
}
