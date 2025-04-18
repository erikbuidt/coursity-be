import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Base } from './base.entity'
import { Course } from './course.entity'
import { User } from './user.entity'
@Entity('enrollments')
export class Enrollment extends Base {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_id' })
  course: Course
}
