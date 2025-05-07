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

  @Column()
  destination: string

  @Column({ unique: true })
  filename: string

  @Column()
  minio_filename: string

  @Column()
  path: string

  @Column({ type: "numeric" })
  size: number

  @Column({ default: false })
  is_public: boolean
}
