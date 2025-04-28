import { Module } from "@nestjs/common"
import { FileController } from "./file.controller"
import { FileService } from "./file.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { File } from "@/entity/file.entity"

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
