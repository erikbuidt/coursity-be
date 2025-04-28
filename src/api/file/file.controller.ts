import { Public } from "@/common/decorators/public.decorator"
import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common"
// biome-ignore lint/style/useImportType: <explanation>
import { FileService } from "./file.service"
import { ClerkAuthGuard } from "@/common/guards/clerk.guard"

@Controller("files")
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @UseGuards(ClerkAuthGuard)
  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.fileService.findOne(id, true)
  }
}
