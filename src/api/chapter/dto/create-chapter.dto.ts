import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator"

export class CreateChapterDto {
  @ApiProperty({ example: 1, description: "Course ID" })
  @IsNumber()
  @IsNotEmpty()
  course_id: number

  @ApiProperty({ example: "Introduction to NestJS", description: "Chapter title" })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: 1, description: "Chapter position in the course" })
  @IsNumber()
  @Min(1)
  position: number
}
