import { Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm'
export class Base {
  @Column({ nullable: true })
  created_by: string

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({ nullable: true })
  updated_by: string

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date

  @Column({ nullable: true })
  deleted_by: string

  @DeleteDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  deleted_at: Date
}
