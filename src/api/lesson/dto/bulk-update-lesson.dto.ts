import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator"

export class BulkUpdateLessonDto {
  @IsArray()
  @IsNotEmpty()
  lessons: UpdateManyLessonDto[]
}
export class UpdateManyLessonDto {
  @ApiProperty({ example: "Introduction to NestJS", description: "Chapter title" })
  @IsString()
  @IsNotEmpty()
  id: number

  @ApiProperty({ example: 1, description: "Lesson position in the course" })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  position: number
}
