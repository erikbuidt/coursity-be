import { Course } from "@/entity/course.entity"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { CourseController } from "./course.controller"
import { CourseService } from "./course.service"
import { Enrollment } from "@/entity/enrollment.entity"
import { CourseProgress } from "@/entity/course-progress.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Course, Enrollment, CourseProgress])],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
