import { Injectable } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from "@/modules/prisma/prisma.service"
import type { CreateChapterDto } from "./dto/create-chapter.dto"
import type { UpdateOneChapterDto } from "./dto/update-chapter.dto"
import { AppException } from "@/common/errors/exception.error"
import { APP_ERROR } from "@/common/errors/app.error"
import type { BulkUpsertChapterDto } from "./dto/bulk-upsert-chapter.dto"
import type { chapters } from "../../generated/prisma/client"

@Injectable()
export class ChapterService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<chapters[]> {
    return this.prisma.chapters.findMany({
      where: { deleted_at: null },
      include: { courses: true },
      orderBy: { position: "asc" },
    })
  }

  async findOne(id: number): Promise<chapters> {
    const chapter = await this.prisma.chapters.findFirst({
      where: { id, deleted_at: null },
      include: { courses: true, lessons: { where: { deleted_at: null } } },
    })

    if (!chapter) {
      throw new AppException(APP_ERROR.CHAPTER_NOT_FOUND)
    }

    return chapter
  }

  async findByCourseId(courseId: number): Promise<chapters[]> {
    return this.prisma.chapters.findMany({
      where: { course_id: courseId, deleted_at: null },
      include: { lessons: { where: { deleted_at: null } } },
      orderBy: { position: "asc" },
    })
  }

  async create(createChapterDto: CreateChapterDto): Promise<chapters> {
    return this.prisma.chapters.create({
      data: {
        ...createChapterDto,
        chapter_lesson_count: 0,
      },
    })
  }

  async update(id: number, updateChapterDto: UpdateOneChapterDto): Promise<chapters> {
    const chapter = await this.prisma.chapters.findFirst({ where: { id, deleted_at: null } })
    if (!chapter) {
      throw new AppException(APP_ERROR.CHAPTER_NOT_FOUND)
    }

    return this.prisma.chapters.update({
      where: { id },
      data: updateChapterDto,
    })
  }

  async remove(id: number): Promise<void> {
    const result = await this.prisma.chapters.updateMany({
      where: { id },
      data: { deleted_at: new Date() },
    })

    if (result.count === 0) {
      throw new AppException(APP_ERROR.CHAPTER_NOT_FOUND)
    }
  }

  async getCompletedChapters(userId: number, courseId: number) {
    return this.prisma.chapter_complete.findMany({
      where: { user_id: userId, course_id: courseId },
      select: { chapter_id: true },
    })
  }

  /**
   * Upsert chapters: create if isNew, update if not
   * @param chapters Array of chapter objects (with isNew flag)
   */
  async upsertChapters(courseId: number, bulkUpsertChapterDto: BulkUpsertChapterDto): Promise<chapters[]> {
    const results: chapters[] = []
    for (const chapter of bulkUpsertChapterDto.chapters) {
      if (chapter.is_new) {
        const { id, is_new, ...createDto } = chapter
        const createChapterDto: CreateChapterDto = {
          ...createDto,
          course_id: courseId,
        }
        const created = await this.create(createChapterDto)
        results.push(created)
      } else {
        const { id, is_new, ...updateDto } = chapter
        const updated = await this.update(id, updateDto)
        results.push(updated)
      }
    }
    return results
  }
}
