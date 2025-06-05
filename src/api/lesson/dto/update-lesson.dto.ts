import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsString, Min } from "class-validator"

export class UpdateLessonDto {
  @ApiProperty({ example: "Lesson Title", description: "Lesson title" })
  @IsString()
  @IsOptional()
  title?: string

  @ApiProperty({ example: 1, description: "Lesson position in the chapter" })
  @IsNumber()
  @Min(1)
  @IsOptional()
  position?: number

  @ApiProperty({ example: "", description: "Video URL (optional)" })
  @IsString()
  @IsOptional()
  video_url?: string

  @ApiProperty({ example: 0, description: "Duration in seconds (optional)" })
  @IsNumber()
  @IsOptional()
  duration?: number

  @ApiProperty({ example: "", description: "Image URL (optional)" })
  @IsString()
  @IsOptional()
  image_url?: string

  @ApiProperty({ example: "minio", description: "Video provider (optional)" })
  @IsString()
  @IsOptional()
  video_provider?: string
}
