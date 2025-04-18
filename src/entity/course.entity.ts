import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user.entity'
import { Chapter } from './chapter.entity'
import { Base } from './base.entity'

@Entity('courses')
export class Course extends Base {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'instructor_id' })
  instructor: User

  @Column()
  title: string

  @Column('text')
  description: string

  @Column({ type: 'numeric' })
  price: number

  @Column()
  category: string

  @Column()
  status: string

  @Column({ default: false })
  discount_enabled: boolean

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  discount_start_time: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  discount_end_time: Date

  @Column({ type: 'numeric', nullable: true })
  discount_price: number

  @Column()
  slug: string

  @Column()
  image_url: string

  @Column({ type: 'numeric' })
  duratation: number

  @Column({ default: false })
  is_free: boolean

  @Column({ type: 'jsonb', nullable: true })
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  requirements: any

  @Column({ type: 'jsonb', nullable: true })
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  will_learns: any

  @OneToMany(
    () => Chapter,
    (chapter) => chapter.course,
  )
  chapters: Chapter[]
}
