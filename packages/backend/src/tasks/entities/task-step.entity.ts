import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity('task_steps')
export class TaskStep {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  taskId: string;

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column()
  order: number;

  @Column({ default: 'PENDING' })
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

  @Column()
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  errorLog: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
