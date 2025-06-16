import { IsArray, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator"

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  description: string

  @IsNumberString()
  @IsNotEmpty()
  price: number

  @IsString()
  @IsOptional()
  category: string

  @IsArray()
  @IsOptional()
  will_learns: string[]

  @IsArray()
  @IsOptional()
  requirements: string[]
}
