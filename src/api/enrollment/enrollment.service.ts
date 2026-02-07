import type { PublicMetadata } from "@/common/interfaces/common.interface"
import { Injectable, InternalServerErrorException } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from "@/modules/prisma/prisma.service"
import type { CreateEnrollmentDto } from "./dto/create-enrollment.dto"
import { AppException } from "@/common/errors/exception.error"
import { APP_ERROR } from "@/common/errors/app.error"

@Injectable()
export class EnrollmentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user: PublicMetadata) {
    return this.prisma.enrollments.findMany({
      where: { user_id: user.db_user_id, deleted_at: null },
      include: { courses: true },
    })
  }

  async create(createEnrollmentDto: CreateEnrollmentDto, user: PublicMetadata) {
    const course = await this.prisma.courses.findFirst({
      where: { id: createEnrollmentDto.course_id, deleted_at: null },
    })
    if (!course) throw new AppException(APP_ERROR.COURSE_NOT_FOUND)

    if (course.is_free || Number(course.price) === 0) {
      const newEnrollment = await this.prisma.enrollments.create({
        data: {
          course_id: createEnrollmentDto.course_id,
          user_id: user.db_user_id,
        },
      })
      return newEnrollment
    }

    throw new InternalServerErrorException("not support")
  }

  private async verifyPayment(paymentToken: string, amount: number): Promise<boolean> {
    if (!paymentToken || amount <= 0) {
      return false
    }
    return true
  }
}
