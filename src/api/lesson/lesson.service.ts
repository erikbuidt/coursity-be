import { Lesson } from "@/entity/lesson.entity"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async fineOne(lessonId: number) {
    return this.lessonRepository
      .createQueryBuilder("lesson")
      .where("lesson.id = :lessonId", { lessonId })
      .select([
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
