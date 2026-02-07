import { Module } from "@nestjs/common"
import { CourseController } from "./course.controller"
import { CourseService } from "./course.service"
import { FileModule } from "../file/file.module"

@Module({
  imports: [FileModule],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
