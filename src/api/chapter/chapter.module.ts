import { Chapter } from "@/entity/chapter.entity"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ChapterController } from "./chapter.controller"
import { ChapterComplete } from "@/entity/chapter-complete.entity"
import { ChapterService } from "./chapter.service"

@Module({
  imports: [TypeOrmModule.forFeature([Chapter, ChapterComplete])],
  controllers: [ChapterController],
  providers: [ChapterService],
  exports: [ChapterService],
})
export class ChapterModule {}
