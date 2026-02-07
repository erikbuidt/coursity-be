import { Global, Module } from "@nestjs/common"
import { PermitService } from "./permit.service"

@Global()
@Module({
  providers: [PermitService],
  exports: [PermitService],
})
export class PermitModule {}
