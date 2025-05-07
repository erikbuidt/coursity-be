import { Course } from "@/entity/course.entity"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { LearningController } from "./learning.controller"
import { LearningService } from "./learning.service"
import { Enrollment } from "@/entity/enrollment.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Course, Enrollment])],
  controllers: [LearningController],
  providers: [LearningService],
  exports: [LearningService],
})
export class LearningModule {}
