import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
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
    (signupschedule) => signupschedule.signuptimetable,
  )
  signupschedule: Signupschedule;

  @Column({ type: 'date' })
  date: number;

  @Column({ type: 'datetime' })
  time: number;
}
//