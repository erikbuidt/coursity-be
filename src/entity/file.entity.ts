import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { Base } from "./base.entity"

@Entity("files")
export class File extends Base {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  originalname: string

  @Column()
  mimetype: string

  @Column({ unique: true })
  filename: string

  @Column({ name: "minio_filename" })
  minioFilename: string

  @Column()
  path: string

  @Column({ type: "numeric" })
  size: number

  @Column({ default: false, name: "is_public" })
  isPublic: boolean
}
