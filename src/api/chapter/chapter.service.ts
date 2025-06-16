import { Chapter } from "@/entity/chapter.entity"
import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import type { CreateChapterDto } from "./dto/create-chapter.dto"
import type { UpdateOneChapterDto } from "./dto/update-chapter.dto"
import { ChapterComplete } from "@/entity/chapter-complete.entity"
import { AppException } from "@/common/errors/exception.error"
import { APP_ERROR } from "@/common/errors/app.error"
import type { BulkUpsertChapterDto } from "./dto/bulk-upsert-chapter.dto"

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
    @InjectRepository(ChapterComplete)
    private readonly chapterCompleteRepository: Repository<ChapterComplete>,
  ) {}

  async findAll(): Promise<Chapter[]> {
    return this.chapterRepository.find({
      relations: ["course"],
      order: { position: "ASC" },
    })
  }

  async findOne(id: number): Promise<Chapter> {
    const chapter = await this.chapterRepository.findOne({
      where: { id },
      relations: ["course", "lessons"],
    })

    if (!chapter) {
      throw new AppException(APP_ERROR.CHAPTER_NOT_FOUND)
    }

    return chapter
  }

  async findByCourseId(courseId: number): Promise<Chapter[]> {
    return this.chapterRepository.find({
      where: { course_id: courseId },
      relations: ["lessons"],
      order: { position: "ASC" },
    })
  }

  async create(createChapterDto: CreateChapterDto): Promise<Chapter> {
    const chapter = this.chapterRepository.create({
      ...createChapterDto,
      chapter_lesson_count: 0, // Initialize with 0 lessons
    })
    return this.chapterRepository.save(chapter)
  }

  async update(id: number, updateChapterDto: UpdateOneChapterDto): Promise<Chapter> {
    const chapter = await this.chapterRepository.findOne({ where: { id } })
    if (!chapter) {
      throw new AppException(APP_ERROR.CHAPTER_NOT_FOUND)
    }

    const updatedChapter = this.chapterRepository.merge(chapter, updateChapterDto)
    return this.chapterRepository.save(updatedChapter)
  }

  async remove(id: number): Promise<void> {
    const result = await this.chapterRepository.delete(id)

    if (result.affected === 0) {
      throw new AppException(APP_ERROR.CHAPTER_NOT_FOUND)
    }
  }

  async getCompletedChapters(userId: number, courseId: number) {
    return this.chapterCompleteRepository.find({
      where: { user_id: userId, course_id: courseId },
      select: ["chapter_id"],
    })
  }

  /**
   * Upsert chapters: create if isNew, update if not
   * @param chapters Array of chapter objects (with isNew flag)
   */
  async upsertChapters(courseId: number, bulkUpsertChapterDto: BulkUpsertChapterDto): Promise<Chapter[]> {
    const results: Chapter[] = []
    for (const chapter of bulkUpsertChapterDto.chapters) {
      if (chapter.is_new) {
        const { id, is_new, ...createDto } = chapter
        // Validate required fields for create
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
