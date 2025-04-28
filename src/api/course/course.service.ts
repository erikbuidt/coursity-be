import { Course } from "@/entity/course.entity"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from "typeorm"
import { type IPaginationOptions, paginate, type Pagination } from "nestjs-typeorm-paginate"
import { toSnakeCaseMeta } from "@/common/utils/app.util"
import type { IPaginationMeta } from "@/common/interfaces/common.interface"
@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}
  async findAll(options: IPaginationOptions): Promise<Pagination<Course, IPaginationMeta>> {
    const data = await paginate<Course>(this.courseRepository, options)
    return {
      items: (await data).items,
      meta: toSnakeCaseMeta(data.meta),
    }
  }
  async fineOne(slug: string) {
    return this.courseRepository
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.chapters", "chapter")
      .leftJoinAndSelect("chapter.lessons", "lesson")
      .where("course.slug = :slug", { slug })
      .select([
        "course.id",
        "course.title",
        "course.description",
        "course.price",
        "chapter.id",
        "chapter.title",
        "chapter.position",
        "lesson.id",
        "lesson.title",
        "lesson.duration",
        "lesson.image_url",
        "lesson.video_provider",
        "lesson.chapter_id",
      ])
      .getOne()
  }
}
