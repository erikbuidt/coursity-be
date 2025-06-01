import { APP_ERROR } from "@/common/errors/app.error"
import { AppException } from "@/common/errors/exception.error"
import { File } from "@/entity/file.entity"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from "typeorm"
import * as Minio from "erik-minio"
// biome-ignore lint/style/useImportType: <explanation>
import { ConfigService } from "@nestjs/config"
import type { CreateFileDto } from "./dto/create-file.dto"
import type { PublicMetadata } from "@/common/interfaces/common.interface"
import { randomUUID, createHash } from "crypto"
import type { Response } from "express"
// biome-ignore lint/style/useImportType: <explanation>
import { HlsService } from "@/modules/hls/hls.service"
import * as path from "node:path"
import { PassThrough } from "node:stream"
import { createReadStream } from "node:fs"
import { stat } from "node:fs/promises"
@Injectable()
export class FileService {
  private minioClient: Minio.Client
  private bucketName: string
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,

    private readonly configService: ConfigService,
    private readonly hlsService: HlsService,
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
    const file = await this.fileRepository.findOne({
      where: { filename: filename, is_public: isPublic },
    })
    if (!file) {
      throw new AppException(APP_ERROR.FILE_NOT_FOUND)
    }
    res.set({
      "Content-Type": file.mimetype, // 'Content-Disposition': `attachment; filename="${file.originalname}"`,
    })
    try {
      const readable = await this.minioClient.getObject(this.bucketName, file.minio_filename)

      res.set({
        "Content-Type": file.mimetype,
        // 'Content-Disposition': `attachment; filename="${file.originalname}"`,
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

    const record = this.fileRepository.create({
      ...createFileDto,
      mimetype: file.mimetype,
      originalname: file.originalname,
      destination: file.destination ?? "N/A",
      filename: file.filename ?? randomUUID(),
      minio_filename: fileName,
      path: file.path ?? "N/A",
      size: file.size,
      is_public: createFileDto.is_public ?? true,
    })

    return this.fileRepository.save(record)
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

  // async uploadChunk(bucket: string, filename: string, uploadId: string, partNumber: number, chunk: Buffer) {
  //   try {
  //     // Generate MD5 hash for the chunk (base64)
  //     const md5Hash = createHash("md5").update(chunk).digest("base64")

  //     const url = `http://${this.configService.get("minio").endPoint}:9000/${
  //       bucket
  //     }/${filename}?uploadId=${uploadId}&partNumber=${partNumber}`

  //     // Direct HTTP request for uploading the part
  //     const response = await axios.put(url, chunk, {
  //       headers: {
  //         "Content-MD5": md5Hash,
  //         "Content-Type": "application/octet-stream",
  //         "x-amz-content-sha256": "UNSIGNED-PAYLOAD",
  //         Authorization: `Bearer ${this.configService.get("minio").accessKey}:${this.configService.get("minio").secretKey}`,
  //       },
  //       maxBodyLength: Number.POSITIVE_INFINITY,
  //       maxContentLength: Number.POSITIVE_INFINITY,
  //     })

  //     // Ensure response has ETag
  //     const etag = response.headers.etag
  //     if (!etag) {
  //       throw new Error("ETag missing from MinIO response.")
  //     }
  //     console.log({ etag })
  //     return { etag }
  //   } catch (error) {
  //     console.log(error)
  //     throw new Error(`Failed to upload part ${error}`)
  //   }
  // }

  // async uploadChunk(bucket: string, filename: string, uploadId: string, partNumber: number, chunk: Buffer) {
  //   const etag = crypto.createHash('md5').update(chunk).digest('hex');
  //   await this.minioClient.putObject(bucket, `${filename}.part.${partNumber}`, chunk);
  //   return { etag };
  // }

  async uploadChunk(bucket: string, filename: string, uploadId: string, partNumber: number, chunk: Buffer) {
    try {
      console.log("Uploading part:", { partNumber, size: chunk.length })

      // Setting required headers (Content-MD5 is recommended)
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

      // Use the MinIO SDK's uploadPart method
      const result = await this.minioClient.uploadPart(partConfig, chunk)

      // Debugging: Log the raw result
      console.log("Upload part raw result:", result)

      if (!result || !result.etag) {
        console.error("Upload Part Error: Missing ETag in response")
        console.error("Full Response:", JSON.stringify(result, null, 2))
        throw new Error("ETag missing from MinIO response.")
      }

      return { etag: result.etag }
    } catch (error) {
      console.error(`Failed to upload part ${partNumber}`, error)
      throw new Error(`Failed to upload part ${partNumber}: ${error.message}`)
    }
  }

  async completeUpload(bucket: string, filename: string, uploadId: string, parts: { partNumber: number; etag: string }[]) {
    // Transforming parts to match the required format
    const formattedParts = parts.map((part) => ({
      part: part.partNumber,
      etag: part.etag,
    }))

    const result = await this.minioClient.completeMultipartUpload(bucket, filename, uploadId, formattedParts)
    return { message: "Upload completed successfully.", result }
  }

  async encodeVideo() {
    // const video = await this.minioClient.getObject(this.bucketName, filename)
    // const videoBuffer = await video.pipe(new PassThrough())
    // const encodedVideo = await this.hlsService.encodeHLS(videoBuffer)
    // return encodedVideo
    const videoPath = path.resolve(__dirname, "..", "..", "assets", "WebHD_720p.mp4")
    const rs = await this.hlsService.encodeHLS(videoPath)
    console.log({ rs })
    return "ok"
  }

  async findVideo(filename: string, req: Request, res: Response, isPublic = true) {
    const range = req.headers["range"]
    const file = await this.fileRepository.findOne({
      where: { filename },
    })
    if (!file) {
      throw new AppException(APP_ERROR.FILE_NOT_FOUND)
    }
    try {
      const fileStat = await this.minioClient.statObject(this.bucketName, file.minio_filename)
      const fileSize = fileStat.size
      if (range) {
        // Parse range header (e.g., "bytes=0-1000" or "bytes=0-")
        const [start, end] = this.getRange(range, fileSize)
        const chunkSize = end - start + 1

        const stream = await this.minioClient.getPartialObject(this.bucketName, file.minio_filename, start, chunkSize)

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
      if (error.code === "ENOENT") {
        res.status(404).send("Video not found")
      } else {
        console.error("Stream error:", error)
        res.status(500).send("Error streaming video")
      }
    }
  }

  // Helper function to parse range
  private getRange(range: string, totalSize: number): [number, number] {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = Number.parseInt(parts[0], 10)
    let end = parts[1] ? Number.parseInt(parts[1], 10) : totalSize - 1

    // Validate and fix range values
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
