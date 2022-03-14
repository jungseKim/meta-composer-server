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
import { Attendance } from './attendance.entity';
import { Lesson } from './lesson.entity';
import { Payment } from './payment.entity';
import { Signupschedule } from './signupschedule.entity';
import { User } from './user.entity';
@Entity()
export class Signup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.signup)
  user: User;

  @ManyToOne((type) => Lesson, (lesson) => lesson.signup,{  onDelete: 'CASCADE',})
  lesson: Lesson;

  @Column()
  merchant_uid:string;
  
  @Column()
  lessonId:number;


  @Column()
  userId:number;

  @OneToMany(
    (type) => Signupschedule,
    (signupschedule) => signupschedule.signup,
  )
  signupschedule: Signupschedule;

  @OneToMany((type) => Payment, (payment) => payment.signup)
  payment: Payment;

  @OneToMany((type) => Attendance, (attendance) => attendance.signup)
  attendance: Attendance;

  // @Column({ type: 'date' })
  // date: string;


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
