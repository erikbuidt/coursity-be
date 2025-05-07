import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm"
import { User } from "./user.entity"
import { Course } from "./course.entity"
import { Base } from "./base.entity"
@Entity("course_progress")
@Unique(["user_id", "course_id"]) // prevent duplicate completions
export class CourseProgress extends Base {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  course_id: number

  @Column()
  user_id: number

  @ManyToOne(
    () => User,
    (user) => user.courseProgress,
  )
  @JoinColumn({ name: "user_id" })
  user: User

  @ManyToOne(() => Course)
  @JoinColumn({ name: "course_id" })
  course: Course

  @Column({ type: "numeric", default: 0 })
  progress_percent: number

  @Column({ type: "timestamp", nullable: true })
  completed_at: Date

  @Column({ nullable: true })
  last_lesson_id: number
}
