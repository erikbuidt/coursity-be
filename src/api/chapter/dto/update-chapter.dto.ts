import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsString, Min } from "class-validator"

export class UpdateChapterDto {
  @ApiProperty({ example: "Introduction to NestJS", description: "Chapter title" })
  @IsString()
  @IsOptional()
  title?: string

  @ApiProperty({ example: 1, description: "Chapter position in the course" })
  @IsNumber()
  @Min(1)
  @IsOptional()
  position?: number
}
