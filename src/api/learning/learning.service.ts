import { APP_ERROR } from "@/common/errors/app.error"
import { AppException } from "@/common/errors/exception.error"
import { Injectable } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from "@/modules/prisma/prisma.service"

@Injectable()
export class LearningService {
  constructor(private readonly prisma: PrismaService) {}

  async isEnrolled(userId: number, courseSlug: string): Promise<boolean> {
    const course = await this.prisma.courses.findFirst({
      where: { slug: courseSlug, deleted_at: null },
    })
    if (!course) return false

    const enrollment = await this.prisma.enrollments.findFirst({
      where: { user_id: userId, course_id: course.id, deleted_at: null },
    })
    return !!enrollment
  }

  async findCourse(slug: string, lessonId: number, userId: number) {
    const enrolled = userId ? await this.isEnrolled(userId, slug) : false
    if (!enrolled) throw new AppException(APP_ERROR.FORBIDDEN_ROLE)

    // Get course with chapters and lessons
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
            },
          },
        },
      },
    })

    if (!course) throw new AppException(APP_ERROR.COURSE_NOT_FOUND)

    // Get completed lessons for this user
    const completedLessons = await this.prisma.lesson_complete.findMany({
      where: { user_id: userId, course_id: course.id, deleted_at: null },
      select: { lesson_id: true, chapter_id: true },
    })

    const completedLessonIds = new Set(completedLessons.map((lc) => lc.lesson_id))
    const chapterCompletedCount = new Map<number, number>()

    for (const lc of completedLessons) {
      const count = chapterCompletedCount.get(lc.chapter_id) ?? 0
      chapterCompletedCount.set(lc.chapter_id, count + 1)
    }

    // Attach is_completed to each lesson and chapter_completed_lesson_count to each chapter
    const chaptersWithCompletion = course.chapters.map((chapter) => ({
      ...chapter,
      chapter_completed_lesson_count: chapterCompletedCount.get(chapter.id) ?? 0,
      lessons: chapter.lessons.map((lesson) => ({
        ...lesson,
        is_completed: completedLessonIds.has(lesson.id),
      })),
    }))

    return {
      ...course,
      chapters: chaptersWithCompletion,
    }
  }

  async completeLesson(userId: number, courseId: number, chapterId: number, lessonId: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // 1. Insert into lesson_complete (upsert to avoid duplicates)
      await tx.lesson_complete.upsert({
        where: {
          user_id_lesson_id: { user_id: userId, lesson_id: lessonId },
        },
        update: {},
        create: {
          user_id: userId,
          course_id: courseId,
          lesson_id: lessonId,
          chapter_id: chapterId,
        },
      })

      // 2. Count total lessons in the chapter
      const totalLessonsInChapter = await tx.lessons.count({
        where: { chapter_id: chapterId, deleted_at: null },
      })

      // 3. Count user's completed lessons in this chapter
      const userCompletedLessons = await tx.lesson_complete.count({
        where: { user_id: userId, chapter_id: chapterId, deleted_at: null },
      })

      if (userCompletedLessons === totalLessonsInChapter) {
        // 4. Mark chapter as complete
        await tx.chapter_complete.upsert({
          where: {
            user_id_chapter_id: { user_id: userId, chapter_id: chapterId },
          },
          update: {},
          create: {
            user_id: userId,
            course_id: courseId,
            chapter_id: chapterId,
          },
        })
      }

      // 5. Count completed lessons in the course
      const completedLessonsCount = await tx.lesson_complete.count({
        where: { user_id: userId, course_id: courseId, deleted_at: null },
      })

      // 6. Count total lessons in the course
      const totalLessons = await tx.lessons.count({
        where: {
          chapters: { course_id: courseId },
          deleted_at: null,
        },
      })

      if (totalLessons > 0) {
        const progress = Math.round((completedLessonsCount / totalLessons) * 100)
        const isCompleted = progress === 100
        const completedAt = isCompleted ? new Date() : null

        // 7. Upsert course progress
        await tx.course_progress.upsert({
          where: {
            user_id_course_id: { user_id: userId, course_id: courseId },
          },
          update: {
            progress_percent: progress,
            last_lesson_id: lessonId,
            completed_at: completedAt,
          },
          create: {
            user_id: userId,
            course_id: courseId,
            progress_percent: progress,
            last_lesson_id: lessonId,
            completed_at: completedAt,
          },
        })
      }
    })
  }
}
