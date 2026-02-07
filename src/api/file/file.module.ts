import { Module } from "@nestjs/common"
import { FileController } from "./file.controller"
import { FileService } from "./file.service"
import { FFmpegModule } from "@/modules/ffmpeg/ffmpeg.module"

@Module({
  imports: [FFmpegModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
