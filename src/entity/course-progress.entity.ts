import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { Course } from './course.entity'
import { Base } from './base.entity'
@Entity('course_progress')
export class CourseProgress extends Base {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(
    () => User,
    (user) => user.courseProgress,
  )
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_id' })
  course: Course

  @Column({ type: 'numeric', default: 0 })
  progress_percentage: number

  @Column({ default: false })
  is_completed: boolean
}
