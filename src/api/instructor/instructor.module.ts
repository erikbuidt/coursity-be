import { Module } from "@nestjs/common"
import { InstructorController } from "./instructor.controller"
import { CourseModule } from "../course/course.module"

@Module({
  imports: [CourseModule],
  controllers: [InstructorController],
  providers: [],
  exports: [],
})
export class InstructorModule {}
