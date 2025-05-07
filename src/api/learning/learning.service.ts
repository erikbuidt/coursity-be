import { APP_ERROR } from "@/common/errors/app.error"
import { AppException } from "@/common/errors/exception.error"
import { Course } from "@/entity/course.entity"
import { Enrollment } from "@/entity/enrollment.entity"
import { InjectRepository } from "@nestjs/typeorm"
// biome-ignore lint/style/useImportType: <explanation>
import { DataSource, Repository } from "typeorm"

export class LearningService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private readonly enrollRepository: Repository<Enrollment>,
    private dataSource: DataSource,
  ) {}

  async isEnrolled(userId: number, courseSlug: string): Promise<boolean> {
    const enrollment = await this.enrollRepository.findOne({
      where: { user: { id: userId }, course: { slug: courseSlug } },
      relations: ["course"],
    })
    return !!enrollment // true if enrolled
  }
  async findCourse(slug: string, lessonId: number, userId: number) {
    const enrolled = userId ? await this.isEnrolled(userId, slug) : false
    if (!enrolled) throw new AppException(APP_ERROR.FORBIDDEN_ROLE)

    const course = await this.courseRepository
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.chapters", "chapter")
      .leftJoinAndSelect("chapter.lessons", "lesson")
      .leftJoin("lesson_complete", "lc", "lc.lesson_id = lesson.id AND lc.user_id = :userId", { userId })
      .where("course.slug = :slug", { slug })
      .addSelect("CASE WHEN lc.id IS NOT NULL THEN true ELSE false END", "is_completed")
      .orderBy("chapter.position", "ASC")
      .orderBy("lesson.position", "ASC")
      .getRawAndEntities()

    const completedLessonMap = new Map<number, boolean>()
    const chapterCompletedLessonMap = new Map<number, number>() // chapter_id -> count
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    // biome-ignore lint/complexity/noForEach: <explanation>
    course.raw.forEach((raw: any) => {
      const lessonId = raw.lesson_id
      const chapterId = raw.chapter_id
      const isCompleted = raw.is_completed === true

      completedLessonMap.set(lessonId, isCompleted)

      if (isCompleted) {
        chapterCompletedLessonMap.set(chapterId, (chapterCompletedLessonMap.get(chapterId) || 0) + 1)
      }
    })

    // ✅ Set is_completed on each lesson entity
    // biome-ignore lint/complexity/noForEach: <explanation>
    course.entities[0].chapters.forEach((chapter) => {
      // biome-ignore lint/complexity/noForEach: <explanation>
      chapter.lessons.forEach((lesson) => {
        lesson.is_completed = completedLessonMap.get(lesson.id) || false
      })

      // ✅ Set completed count
      chapter.chapter_completed_lesson_count = chapterCompletedLessonMap.get(chapter.id) || 0
    })

    return course.entities[0]
  }

  async completeLesson(userId: number, courseId: number, chapterId: number, lessonId: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      // 1. Insert into lesson_complete
      await manager
        .createQueryBuilder()
        .insert()
        .into("lesson_complete")
        .values({
          user_id: userId,
          course_id: courseId,
          lesson_id: lessonId,
          chapter_id: chapterId,
        })
        .orIgnore()
        .execute()

      // 2. Count total lessons in the chapter
      const totalLessonsInChapter = await manager.getRepository("lessons").count({ where: { chapter_id: chapterId } })

      // 3. Count user's completed lessons in this chapter
      const userCompletedLessons = await manager
        .getRepository("lesson_complete")
        .count({ where: { user_id: userId, chapter_id: chapterId } })

      if (userCompletedLessons === totalLessonsInChapter) {
        // 4. Mark chapter as complete
        await manager
          .createQueryBuilder()
          .insert()
          .into("chapter_complete")
          .values({ user_id: userId, course_id: courseId, chapter_id: chapterId })
          .orIgnore()
          .execute()
      }
      // 5. Count total lessons in the course
      const completedLessonsCount = await manager
        .getRepository("lesson_complete")
        .count({ where: { user_id: userId, course_id: courseId } })

      const totalLessons = await manager
        .getRepository("lessons")
        .createQueryBuilder("lesson")
        .innerJoin("lesson.chapter", "chapter")
        .where("chapter.course_id = :courseId", { courseId })
        .getCount()

      if (totalLessons > 0) {
        const progress = Math.round((completedLessonsCount / totalLessons) * 100)
        const isCompleted = progress === 100
        const completedAt = isCompleted ? new Date() : null
        await manager.query(
          `
          INSERT INTO course_progress (user_id, course_id, progress_percent, last_lesson_id, completed_at)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (user_id, course_id)
          DO UPDATE SET 
            progress_percent = $3, 
            last_lesson_id = $4,
            completed_at = CASE WHEN $3 = 100 THEN NOW() ELSE NULL END
          `,
          [userId, courseId, progress, lessonId, completedAt],
        )
      }
    })
  }
}
