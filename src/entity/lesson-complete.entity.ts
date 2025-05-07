import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm"
import { Base } from "./base.entity"
import { User } from "./user.entity"
import { Lesson } from "./lesson.entity"
import { Course } from "./course.entity"
import { Chapter } from "./chapter.entity"

@Entity("lesson_complete")
@Unique(["user_id", "lesson_id"]) // prevent duplicate completions
export class LessonComplete extends Base {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  user_id: number

  @Column()
  chapter_id: number

  @Column()
  lesson_id: number

  @Column()
  course_id: number

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User

  @ManyToOne(() => Lesson)
  @JoinColumn({ name: "lesson_id" })
  lesson: Lesson

  @ManyToOne(() => Course)
  @JoinColumn({ name: "course_id" })
  course: Course

  @ManyToOne(() => Chapter)
  @JoinColumn({ name: "chapter_id" })
  chapter: Chapter
}
