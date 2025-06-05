import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"

export class CreateFileDto {
  @ApiProperty({ type: Boolean, example: true })
  @Transform(({ value }) => {
    return value === "true"
  })
  is_public: boolean

  @ApiProperty({ type: String, example: "" })
  sub_bucket: string
}

export class CreateFilesDto {
  @ApiProperty({ type: String, format: "binary", isArray: true })
  file: Express.Multer.File[]
}
