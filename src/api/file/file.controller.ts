import { Public } from "@/common/decorators/public.decorator"
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
  Query,
  BadRequestException,
} from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { FileService } from "./file.service"
import { ClerkAuthGuard } from "@/common/guards/clerk.guard"
import { FileInterceptor } from "@nestjs/platform-express"
import type { CreateFileDto } from "./dto/create-file.dto"
import type { PublicMetadata } from "@/common/interfaces/common.interface"
import { User } from "@/common/decorators/user.decorator"
import type { Response } from "express"

@Controller("files")
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Get(":filename")
  @Public()
  findOne(@Param("filename") filename: string, @Res() res: Response) {
    return this.fileService.findOne(filename, res, true)
  }

  @Post("/upload")
  @UseInterceptors(FileInterceptor("file"))
  // @Permissions(ActionPermission.CREATE_FILE)
  create(
    @Body() createFileDto: CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: PublicMetadata,
  ) {
    return this.fileService.create(createFileDto, file, user)
  }

  @Post("/upload/init")
  @Public()
  async initUpload(@Body() body: { filename: string; bucket: string }) {
    return this.fileService.initiateMultipartUpload(body.filename, body.bucket)
  }

  @Post("/upload/chunk")
  @Public()
  @UseInterceptors(FileInterceptor("chunk"))
  async uploadChunk(
    @UploadedFile() file: Express.Multer.File,
    @Query("bucket") bucket: string,
    @Query("filename") filename: string,
    @Query("upload_id") uploadId: string,
    @Query("part_number") partNumber: number,
  ) {
    return this.fileService.uploadChunk(bucket, filename, uploadId, partNumber, file.buffer)
  }

  @Post("/upload/complete")
  async completeUpload(
    @Body() body: {
      filename: string
      bucket: string
      upload_id: string
      parts: { partNumber: number; etag: string }[]
    },
  ) {
    const { bucket, filename, upload_id, parts } = body
    console.log("here")
    console.log({ bucket, filename, upload_id, parts: parts.length })
    if (!bucket || !filename || !upload_id || !Array.isArray(parts) || parts.length === 0) {
      throw new BadRequestException("Invalid request payload")
    }

    return this.fileService.completeUpload(bucket, filename, upload_id, parts)
  }
}
