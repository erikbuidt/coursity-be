import { Enrollment } from "@/entity/enrollment.entity"
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { EnrollmentController } from "./enrollment.controller"
import { EnrollmentService } from "./enrollment.service"
import { Course } from "@/entity/course.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Course])],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
