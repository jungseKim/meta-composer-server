import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import { Signup } from './signup.entity';
import { Signuptimetable } from './signuptimetable.entity';
import { User } from './user.entity';
@Entity()
export class Signupschedule extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Signup, (signup) => signup.signupschedule)
  signup: Signup;

  @Column({ type: 'date' })
  startdate: number;

  @Column({ type: 'date' })
  finishdate: number;

  @OneToMany(
    (type) => Signuptimetable,
    (signuptimetable) => signuptimetable.signupschedule,
  )
  signuptimetable: Signuptimetable;
}
//asd