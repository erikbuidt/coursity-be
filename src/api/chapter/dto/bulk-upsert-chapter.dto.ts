import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Min, ValidateNested } from "class-validator"

export class BulkUpsertChapterDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpsertManyChapterDto)
  chapters: UpsertManyChapterDto[]
}
export class UpsertManyChapterDto {
  @ApiProperty({ example: "Introduction to NestJS", description: "Chapter title" })
  @IsNumber()
  @IsOptional()
  id: number

  @ApiProperty({ example: "Introduction to NestJS", description: "Chapter title" })
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty({ example: 1, description: "Chapter position in the course" })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  position: number

  @IsBoolean()
  @IsNotEmpty()
  is_new: boolean
}
