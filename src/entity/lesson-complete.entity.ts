import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Lesson } from './lesson.entity'
import { User } from './user.entity'
import { Base } from './base.entity'
@Entity('lesson_complete')
export class UserLessonComplete extends Base {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Lesson)
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson
}
