import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @ManyToOne((type) => User, (user) => user.wishlist)
  user: User;

  @ManyToOne((type) => Lesson, (lesson) => lesson.wishlist)
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
}
//