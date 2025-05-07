import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Base } from "./base.entity"
import { Chapter } from "./chapter.entity"
import { Expose } from "class-transformer"
@Entity("lessons")
export class Lesson extends Base {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    () => Chapter,
    (chapter) => chapter.lessons,
  )
  @JoinColumn({ name: "chapter_id" })
  chapter: Chapter

  @Column()
  chapter_id: number

  @Column({ type: "numeric" })
  duration: number

  @Column()
  video_url: string

  @Column()
  image_url: string

  @Column()
  video_provider: string

  @Column()
  title: string

  @Column({ nullable: true })
  position: number

  @Expose()
  is_completed?: boolean
}
