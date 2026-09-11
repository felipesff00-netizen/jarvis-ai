import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('skills')
export class Skill {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  version: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  enabled: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  installedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
