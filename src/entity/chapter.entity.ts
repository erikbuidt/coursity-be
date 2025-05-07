import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Course } from "./course.entity"
import { Lesson } from "./lesson.entity"
import { Base } from "./base.entity"
import { Expose } from "class-transformer"
@Entity("chapters")
export class Chapter extends Base {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  course_id: number

  @ManyToOne(
    () => Course,
    (course) => course.chapters,
  )
  @JoinColumn({ name: "course_id" })
  course: Course

  @Column()
  title: string

  @Column()
  position: number

  @Column()
  chapter_lesson_count: number

  @OneToMany(
    () => Lesson,
    (lesson) => lesson.chapter,
  )
  lessons: Lesson[]

  @Expose()
  chapter_completed_lesson_count?: number // ✅ add this
}
