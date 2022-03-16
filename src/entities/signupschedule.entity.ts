import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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
    () => Signuptimetable,
    (signuptimetable) => signuptimetable.signupschedule,{eager : true }
  )
  signuptimetables: Signuptimetable[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
