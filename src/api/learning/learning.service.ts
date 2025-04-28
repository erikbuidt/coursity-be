import { Course } from "@/entity/course.entity"
import { InjectRepository } from "@nestjs/typeorm"
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from "typeorm"

export class LearningService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}
  async fineOne(slug: string, lessonId: number, userId: number) {
    console.log({ slug, lessonId, userId })
  }
}
