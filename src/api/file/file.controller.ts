import { Public } from "@/common/decorators/public.decorator"
import { User } from "@/common/decorators/user.decorator"
import type { PublicMetadata } from "@/common/interfaces/common.interface"
import { BadRequestException, Body, Controller, Get, Header, Param, Post, Query, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import type { Response } from "express"
import type { CreateFileDto } from "./dto/create-file.dto"
// biome-ignore lint/style/useImportType: <explanation>
import { FileService } from "./file.service"

@Controller("files")
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Get(":filename")
  @Public()
  @Header("Accept-Ranges", "bytes")
  findOne(@Param("filename") filename: string, @Res() res: Response) {
    const range = res.req.headers.range
    return this.fileService.findOne(filename, res, true)
  }

  @Post("/upload")
  @UseInterceptors(FileInterceptor("file"))
  // @Permissions(ActionPermission.CREATE_FILE)
  create(@Body() createFileDto: CreateFileDto, @UploadedFile() file: Express.Multer.File, @User() user: PublicMetadata) {
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

  @Public()
  @Post("/encode-video")
  encodeVideo() {
    return this.fileService.encodeVideo()
  }

  @Get("video/:filename")
  @Header("Accept-Ranges", "bytes")
  findVideo(@Param("filename") filename: string, @Req() req: Request, @Res() res: Response) {
    return this.fileService.findVideo(filename, req, res, true)
  }
}
