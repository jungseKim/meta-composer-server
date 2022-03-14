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

  @ManyToOne((type) => User, (user) => user.attendance)
  user: User;

  @ManyToOne((type) => Teacher, (teacher) => teacher.attendance)
  teacher: Teacher;

  @ManyToOne((type) => Signup, (signup) => signup.attendance)
  signup: Signup;

  @Column({ type: 'date' })
  date: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
