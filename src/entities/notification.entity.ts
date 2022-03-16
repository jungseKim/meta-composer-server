import { type } from 'os';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  type: string;
  //enum?

  @Column({ type: 'datetime' })
  readTime: number;
  //nullbale

  @Column()
  notifiable: string;

  @Column()
  data: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne((type) => User, (user) => user.notifications)
  user: User;

  @Column({ name: 'userId' })
  //join 칼럼명 이름바꾸기2
  userId: number;
}
