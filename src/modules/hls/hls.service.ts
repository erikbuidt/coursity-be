import { Injectable, Logger } from "@nestjs/common"
import { spawn } from "node:child_process"
import * as fs from "node:fs"
import * as path from "node:path"

const MAXIMUM_BITRATE_720P = 5 * 10 ** 6 // 5Mbps
const MAXIMUM_BITRATE_1080P = 8 * 10 ** 6 // 8Mbps
const MAXIMUM_BITRATE_1440P = 16 * 10 ** 6 // 16Mbps

@Injectable()
export class HlsService {
  private readonly logger = new Logger(HlsService.name)

  private async runFFmpegCommand(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn("ffmpeg", args)

      ffmpeg.stderr.on("data", (data) => this.logger.error(data.toString()))

      ffmpeg.on("close", (code) => {
        if (code === 0) {
          resolve("success")
        } else {
          reject(new Error(`FFmpeg process exited with code ${code}`))
        }
      })
    })
  }

  private async getBitrate(filePath: string): Promise<number> {
    const output = await this.runFFmpegProbe(filePath, [
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=bit_rate",
      "-of",
      "default=nw=1:nk=1",
      "-v",
      "error",
    ])

    const bitrate = Number.parseInt(output.trim(), 10)
    if (Number.isNaN(bitrate)) {
      throw new Error(`Failed to get bitrate for file: ${filePath}`)
    }

    return bitrate
  }

  private async getResolution(filePath: string): Promise<{ width: number; height: number }> {
    const output = await this.runFFmpegProbe(filePath, [
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height",
    ])
    const cleanOutput = output.replace(/\r?\n/g, "x").trim()
    const [width, height] = cleanOutput.split("x").map(Number)
    return { width, height }
  }

  private async checkVideoHasAudio(filePath: string): Promise<boolean> {
    const result = await this.runFFmpegProbe(filePath, ["-select_streams", "a:0", "-show_entries", "stream=codec_type"])
    return result.trim() === "audio"
  }

  private async runFFmpegProbe(filePath: string, args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const ffprobe = spawn("ffprobe", ["-v", "error", ...args, "-of", "default=nw=1:nk=1", filePath])

      let output = ""

      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      ffprobe.stdout.on("data", (data) => (output += data.toString()))
      ffprobe.stderr.on("data", (data) => this.logger.error(data.toString()))

      ffprobe.on("close", (code) => {
        if (code === 0) resolve(output.trim())
        else reject(new Error(`FFprobe process exited with code ${code}`))
      })
    })
  }

  async encodeHLS(inputPath: string): Promise<void> {
    const bitrate = await this.getBitrate(inputPath)
    const resolution = await this.getResolution(inputPath)
    const hasAudio = await this.checkVideoHasAudio(inputPath)

    const outputDir = path.resolve(
      "C:\\Users\\70018638\\Documents\\my-projects\\course-platform\\coursity-api\\hls_output",
    )
    fs.mkdirSync(outputDir, { recursive: true })

    const targetResolutions = this.getTargetResolutions(resolution.height)
    const args = ["-y", "-i", inputPath, "-preset", "veryslow", "-g", "48", "-sc_threshold", "0"]

    targetResolutions.forEach((res, index) => {
      args.push(
        "-map",
        "0:0",
        `-s:v:${index}`,
        `${this.getWidth(res, resolution)}x${res}`,
        `-c:v:${index}`,
        "libx264",
        `-b:v:${index}`,
        `${Math.min(bitrate, this.getMaxBitrate(res))}`,
      )
      if (hasAudio) {
        args.push("-map", "0:1", `-c:a:${index}`, "aac")
      }
    })

    args.push(
      "-f",
      "hls",
      "-hls_time",
      "6",
      "-hls_list_size",
      "0",
      "-var_stream_map",
      targetResolutions.map((_, i) => (hasAudio ? `v:${i},a:${i}` : `v:${i}`)).join(" "),
      "-master_pl_name",
      "master.m3u8",
      "-hls_segment_filename",
      path.join(outputDir, "v%v/segment_%03d.ts"),
      path.join(outputDir, "v%v/master.m3u8"),
    )
    // Log full CLI command
    this.logger.log(`FFmpeg CLI Command: ffmpeg ${args.join(" ")}`)
    await this.runFFmpegCommand(args)
  }

  // Utility method to determine target resolutions based on input height
  private getTargetResolutions(inputHeight: number): number[] {
    if (inputHeight <= 720) {
      return [720]
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (inputHeight <= 1080) {
      return [720, 1080]
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (inputHeight <= 1440) {
      return [720, 1080, 1440]
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      return [720, 1080, inputHeight]
    }
  }

  // Calculate width while maintaining aspect ratio
  private getWidth(targetHeight: number, original: { width: number; height: number }): number {
    const aspectRatio = original.width / original.height
    const targetWidth = Math.round(targetHeight * aspectRatio)
    console.log({ original, targetWidth, targetHeight })
    // Ensure the width doesn't exceed the target height aspect ratio limit
    return Math.min(targetWidth, targetHeight * (16 / 9)) // 16:9 is the most common aspect ratio
  }

  // Define bitrate limits for each resolution
  private getMaxBitrate(height: number): number {
    switch (height) {
      case 720:
        return 5000 * 1024 // 5Mbps
      case 1080:
        return 8000 * 1024 // 8Mbps
      case 1440:
        return 16000 * 1024 // 16Mbps
      default:
        return 16000 * 1024 // Default to 16Mbps for higher resolutions
    }
  }
}
