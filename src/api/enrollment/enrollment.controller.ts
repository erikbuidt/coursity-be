import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { EnrollmentService } from "./enrollment.service"
import { User } from "@/common/decorators/user.decorator"
import type { PublicMetadata } from "@/common/interfaces/common.interface"
// biome-ignore lint/style/useImportType: <explanation>
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto"

@Controller("enrollments")
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get()
  getAll(@User() user: PublicMetadata) {
    return this.enrollmentService.findAll(user)
  }

  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto, @User() user: PublicMetadata) {
    console.log({ createEnrollmentDto })
    return this.enrollmentService.create(createEnrollmentDto, user)
  }
}
