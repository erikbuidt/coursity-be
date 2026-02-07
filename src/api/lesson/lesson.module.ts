import { Module } from "@nestjs/common"
import { LessonController } from "./lesson.controller"
import { LessonService } from "./lesson.service"
import { FileModule } from "../file/file.module"
import { FFmpegModule } from "@/modules/ffmpeg/ffmpeg.module"
import { LearningModule } from "../learning/learning.module"

@Module({
  imports: [FileModule, FFmpegModule, LearningModule],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule {}
