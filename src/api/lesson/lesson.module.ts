import { LessonComplete } from "@/entity/lesson-complete.entity"
import { Lesson } from "@/entity/lesson.entity"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { FileModule } from "../file/file.module"
import { LearningModule } from "../learning/learning.module"
import { LessonController } from "./lesson.controller"
import { LessonService } from "./lesson.service"

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, LessonComplete]), LearningModule, FileModule],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule {}
