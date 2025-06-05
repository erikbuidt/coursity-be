import { Global, Module } from "@nestjs/common"
import { FFmpegService } from "./ffmpeg.service"

@Global()
@Module({
  imports: [],
  providers: [FFmpegService],
  exports: [FFmpegService],
})
export class FFmpegModule {}
