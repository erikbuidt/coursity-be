import { Global, Module } from "@nestjs/common"
import { HlsService } from "./hls.service"

@Global()
@Module({
  imports: [],
  providers: [HlsService],
  exports: [HlsService],
})
export class HlsModule {}
