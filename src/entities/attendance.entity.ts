import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Signup } from './signup.entity';
import { Teacher } from './teacher.entity';
import { User } from './user.entity';

@Entity()
export class Attendance extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.attendances)
  user: User;

  @ManyToOne(() => Teacher, (teacher) => teacher.attendances)
  teacher: Teacher;

  @ManyToOne(() => Signup, (signup) => signup.attendances)
  signup: Signup;

  @Column({ type: 'date' })
  date: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
