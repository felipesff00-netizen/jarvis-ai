import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Skill } from '../../skills/entities/skill.entity';

@Entity('tools')
export class Tool {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  skillId: string;

  @ManyToOne(() => Skill)
  @JoinColumn({ name: 'skillId' })
  skill: Skill;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  parameters: Record<string, any>;

  @Column({ default: 'LOW_RISK' })
  riskLevel: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | 'CRITICAL';

  @Column()
  version: string;

  @CreateDateColumn()
  createdAt: Date;
}
