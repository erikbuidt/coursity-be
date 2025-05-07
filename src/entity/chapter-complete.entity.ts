import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique, JoinColumn } from "typeorm"
import { User } from "./user.entity"
import { Chapter } from "./chapter.entity"
import { Course } from "./course.entity"

@Entity("chapter_complete")
@Unique(["user_id", "chapter_id"])
export class ChapterComplete {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  user_id: number

  @Column()
  course_id: number

  @Column()
  chapter_id: number

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User

  @ManyToOne(() => Chapter)
  @JoinColumn({ name: "chapter_id" })
  chapter: Chapter

  @ManyToOne(() => Course)
  @JoinColumn({ name: "course_id" })
  course: Course
}
