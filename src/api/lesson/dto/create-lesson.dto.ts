import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Min } from "class-validator"

export class CreateLessonDto {
  @ApiProperty({ example: 1, description: "Chapter ID" })
  @IsNumberString()
  @IsNotEmpty()
  chapter_id: number

  @ApiProperty({ example: "Lesson Title", description: "Lesson title" })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: "", description: "Video URL (optional)" })
  @IsString()
  @IsOptional()
  video_url?: string

  @ApiProperty({ example: "", description: "Image URL (optional)" })
  @IsString()
  @IsOptional()
  image_url?: string

  @ApiProperty({ example: "minio", description: "Video provider (optional)" })
  @IsString()
  @IsNotEmpty()
  video_provider?: string
}
