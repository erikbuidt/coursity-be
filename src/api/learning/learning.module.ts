import { Course } from "@/entity/course.entity"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { LearningController } from "./learning.controller"
import { LearningService } from "./learning.service"

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [LearningController],
  providers: [LearningService],
  exports: [LearningService],
})
export class LearningModule {}
