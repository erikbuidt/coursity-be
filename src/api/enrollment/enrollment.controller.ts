import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { EnrollmentService } from "./enrollment.service"
import { ClerkAuthGuard } from "@/common/guards/clerk.guard"
import { User } from "@/common/decorators/user.decorator"
import type { PublicMetadata } from "@/common/interfaces/common.interface"
import type { CreateEnrollmentDto } from "./dto/create-enrollment.dto"

@Controller("enrollments")
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get()
  getAll(@User() user: PublicMetadata) {
    return this.enrollmentService.findAll(user)
  }

  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto, @User() user: PublicMetadata) {
    return this.enrollmentService.create(createEnrollmentDto, user)
  }
}
