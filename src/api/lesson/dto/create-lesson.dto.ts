import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator"

export class CreateLessonDto {
  @ApiProperty({ example: 1, description: "Chapter ID" })
  @IsNumber()
  @IsNotEmpty()
  chapter_id: number

  @ApiProperty({ example: "Lesson Title", description: "Lesson title" })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: 1, description: "Lesson position in the chapter" })
  @IsNumber()
  @Min(1)
  position: number

  @ApiProperty({ example: "", description: "Video URL (optional)" })
  @IsString()
  @IsOptional()
  video_url?: string

  @ApiProperty({ example: 0, description: "Duration in seconds (optional)" })
  @IsNumber()
  @Min(0)
  duration: number

  @ApiProperty({ example: "", description: "Image URL (optional)" })
  @IsString()
  @IsOptional()
  image_url?: string

  @ApiProperty({ example: "minio", description: "Video provider (optional)" })
  @IsString()
  @IsOptional()
  video_provider?: string
}
