import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('devices')
export class Device {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  name: string;

  @Column()
  type: 'PHONE' | 'TABLET' | 'COMPUTER' | 'TV' | 'SMART_HOME' | 'BLUETOOTH' | 'AUDIO' | 'WEARABLE' | 'OTHER';

  @Column({ type: 'jsonb', default: [] })
  capabilities: string[];

  @Column({ nullable: true })
  lastSeen: Date;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
