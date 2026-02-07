import { APP_ERROR } from "@/common/errors/app.error"
import { AppException } from "@/common/errors/exception.error"
import { Injectable } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { PrismaService } from "@/modules/prisma/prisma.service"
import * as Minio from "erik-minio"
// biome-ignore lint/style/useImportType: <explanation>
import { ConfigService } from "@nestjs/config"
import type { CreateFileDto } from "./dto/create-file.dto"
import type { PublicMetadata } from "@/common/interfaces/common.interface"
import { randomUUID, createHash } from "crypto"
import type { Response } from "express"
// biome-ignore lint/style/useImportType: <explanation>
import { FFmpegService } from "@/modules/ffmpeg/ffmpeg.service"
import * as path from "node:path"

@Injectable()
export class FileService {
  private minioClient: Minio.Client
  private bucketName: string

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly ffmpegService: FFmpegService,
  ) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get("minio").endPoint,
      port: Number(this.configService.get("minio").port),
      useSSL: this.configService.get("minio").useSSL,
      accessKey: this.configService.get("minio").accessKey,
      secretKey: this.configService.get("minio").secretKey,
    })
    this.bucketName = this.configService.get("minio").bucketName
  }

  async findOne(filename: string, res: Response, isPublic = true) {
    const file = await this.prisma.files.findFirst({
      where: { filename, is_public: isPublic, deleted_at: null },
    })
    if (!file) {
      throw new AppException(APP_ERROR.FILE_NOT_FOUND)
    }
    res.set({
      "Content-Type": file.mimetype,
    })
    try {
      const readable = await this.minioClient.getObject(this.bucketName, file.minio_filename)
      res.set({
        "Content-Type": file.mimetype,
      })
      return readable.pipe(res)
    } catch (error) {
      console.log(error)
    }
  }

  async create(createFileDto: CreateFileDto, file: Express.Multer.File, meta?: PublicMetadata) {
    await this.createBucketIfNotExists()

    const fileName = `${createFileDto.sub_bucket}/${file.originalname}`
    await this.minioClient.putObject(this.bucketName, fileName, file.buffer, file.size)

    const record = await this.prisma.files.create({
      data: {
        mimetype: file.mimetype,
        originalname: file.originalname,
        destination: file.destination ?? "N/A",
        filename: file.filename ?? randomUUID(),
        minio_filename: fileName,
        path: file.path ?? "N/A",
        size: file.size,
        is_public: createFileDto.is_public ?? true,
      },
    })
    return record
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName)
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName)
    }
  }

  async initiateMultipartUpload(filename: string, bucket: string) {
    const uploadId = await this.minioClient.initiateNewMultipartUpload(bucket, filename, {})
    return { upload_id: uploadId }
  }

  async uploadChunk(bucket: string, filename: string, uploadId: string, partNumber: number, chunk: Buffer) {
    try {
      const md5Hash = createHash("md5").update(chunk).digest("base64")

      const partConfig = {
        bucketName: bucket,
        objectName: filename,
        uploadID: uploadId,
        partNumber,
        headers: {
          "Content-MD5": md5Hash,
          "Content-Type": "application/octet-stream",
        },
      }

      const result = await this.minioClient.uploadPart(partConfig, chunk)

      if (!result || !result.etag) {
        console.error("Upload Part Error: Missing ETag in response")
        console.error("Full Response:", JSON.stringify(result, null, 2))
        throw new Error("ETag missing from MinIO response.")
      }

      return { etag: result.etag }
    } catch (error) {
      console.error(`Failed to upload part ${partNumber}`, error)
      throw new Error(`Failed to upload part ${partNumber}: ${(error as Error).message}`)
    }
  }

  async completeUpload(bucket: string, filename: string, uploadId: string, parts: { partNumber: number; etag: string }[]) {
    const formattedParts = parts.map((part) => ({
      part: part.partNumber,
      etag: part.etag,
    }))

    const result = await this.minioClient.completeMultipartUpload(bucket, filename, uploadId, formattedParts)
    return { message: "Upload completed successfully.", result }
  }

  async encodeVideo() {
    const videoPath = path.resolve(__dirname, "..", "..", "assets", "4kvideo.mp4")
    await this.ffmpegService.generateMp4Resolutions(videoPath)
    return "ok"
  }

  async findVideo(filename: string, req: Request, res: Response, isPublic = true) {
    const range = req.headers["range"]
    const file = await this.prisma.files.findFirst({
      where: { filename, deleted_at: null },
    })
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("MinIO statObject timeout")), 5000))
    if (!file) {
      throw new AppException(APP_ERROR.FILE_NOT_FOUND)
    }
    try {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const fileStat: any = await Promise.race([this.minioClient.statObject(this.bucketName, file.minio_filename), timeout])
      const fileSize = fileStat.size
      if (range) {
        const [start, end] = this.getRange(range, fileSize)
        const chunkSize = end - start + 1

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const stream: any = await Promise.race([
          this.minioClient.getPartialObject(this.bucketName, file.minio_filename, start, chunkSize),
          new Promise((_, reject) => setTimeout(() => reject(new Error("MinIO getPartialObject timeout")), 5000)),
        ])
        res.status(206)
        res.header({
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": "video/mp4",
        })
        stream.pipe(res)
      }
    } catch (error) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      if ((error as any).code === "ENOENT") {
        res.status(404).send("Video not found")
      } else {
        console.error("Stream error:", error)
        res.status(500).send("Error streaming video")
      }
    }
  }

  private getRange(range: string, totalSize: number): [number, number] {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = Number.parseInt(parts[0], 10)
    let end = parts[1] ? Number.parseInt(parts[1], 10) : totalSize - 1

    end = Math.min(end, totalSize - 1)
    if (Number.isNaN(start) || start < 0 || start >= totalSize) {
      throw new Error("Invalid start of range")
    }
    if (Number.isNaN(end) || end < 0 || end >= totalSize || start > end) {
      throw new Error("Invalid end of range")
    }

    return [start, end]
  }
}
