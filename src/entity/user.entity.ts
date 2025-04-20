import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { CourseProgress } from './course-progress.entity'
import { Enrollment } from './enrollment.entity'
import { Base } from './base.entity'

@Entity('users')
export class User extends Base {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  full_name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ default: 'student' }) // or 'instructor', 'admin'
  role: string

  @OneToMany(
    () => CourseProgress,
    (cp) => cp.user,
  )
  courseProgress: CourseProgress[]

  @OneToMany(
    () => Enrollment,
    (enroll) => enroll.user,
  )
  enrollments: Enrollment[]
}
