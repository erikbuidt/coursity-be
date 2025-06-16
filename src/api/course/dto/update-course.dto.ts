import { IsArray, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  title: string

  @IsString()
  @IsOptional()
  description: string

  @IsNumberString()
  @IsOptional()
  price: number

  @IsString()
  @IsOptional()
  category: string

  @IsString()
  @IsOptional()
  image_url: string

  @IsArray()
  @IsOptional()
  will_learns: string[]

  @IsArray()
  @IsOptional()
  requirements: string[]
}
