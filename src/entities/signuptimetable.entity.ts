import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import { Signup } from './signup.entity';
import { Signupschedule } from './signupschedule.entity';
import { User } from './user.entity';
@Entity()
export class Signuptimetable extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    (type) => Signupschedule,
    (signupschedule) => signupschedule.signuptimetables,
  )
  signupschedule: Signupschedule;

  @Column({ type: 'date' })
  date: number;

  @Column({ type: 'datetime' })
  time: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;



}
