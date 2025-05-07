import type { PublicMetadata } from "@/common/interfaces/common.interface"
import { Enrollment } from "@/entity/enrollment.entity"
import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from "typeorm"
import type { CreateEnrollmentDto } from "./dto/create-enrollment.dto"
import { Course } from "@/entity/course.entity"
import { AppException } from "@/common/errors/exception.error"
import { APP_ERROR } from "@/common/errors/app.error"

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async findAll(user: PublicMetadata) {
    console.log({ user })
    return this.enrollmentRepository.find({ where: { user_id: user.db_user_id }, relations: ["course"] })
  }

  async create(createEnrollmentDto: CreateEnrollmentDto, user: PublicMetadata) {
    const course = await this.courseRepository.findOne({ where: { id: createEnrollmentDto.course_id } })
    if (!course) throw new AppException(APP_ERROR.COURSE_NOT_FOUND)

    if (course.is_free) {
      const newEnrollment = this.enrollmentRepository.create({
        course_id: createEnrollmentDto.course_id,
        user_id: user.db_user_id,
      })
      const savedEnrollment = await this.enrollmentRepository.save(newEnrollment)
      return savedEnrollment
    }

    // Handle payment-required courses
    // if (!course.is_free) {
    //   // Placeholder for payment verification logic
    //   const paymentVerified = await this.verifyPayment(createEnrollmentDto.payment_token, course.price)
    //   if (!paymentVerified) {
    //     throw new AppException(APP_ERROR.PAYMENT_VERIFICATION_FAILED)
    //   }

    //   const newEnrollment = this.enrollmentRepository.create({
    //     course_id: createEnrollmentDto.course_id,
    //     user_id: user.db_user_id,
    //   })
    //   const savedEnrollment = await this.enrollmentRepository.save(newEnrollment)
    //   return savedEnrollment
    // }
    throw new InternalServerErrorException("not support")
  }

  private async verifyPayment(paymentToken: string, amount: number): Promise<boolean> {
    // Simulate payment verification logic
    // Replace this with actual integration with a payment gateway
    if (!paymentToken || amount <= 0) {
      return false
    }
    return true
  }
}
