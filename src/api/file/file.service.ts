import { APP_ERROR } from "@/common/errors/app.error"
import { AppException } from "@/common/errors/exception.error"
import { File } from "@/entity/file.entity"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
// biome-ignore lint/style/useImportType: <explanation>
import { Repository } from "typeorm"

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}
  async findOne(id: number, isPublic = true, res?: Response) {
    const file = await this.fileRepository.findOne({
      where: { id, isPublic },
    })
    if (!file) {
      throw new AppException(APP_ERROR.FILE_NOT_FOUND)
    }
    console.log({ file })
    return file
  }
}
