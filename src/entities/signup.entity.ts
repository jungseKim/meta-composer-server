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

  @ManyToOne((type) => User, (user) => user.signups)
  user: User;

  @ManyToOne((type) => Lesson, (lesson) => lesson.signups,{  onDelete: 'CASCADE',})
  lesson: Lesson;

  @Column()
  merchant_uid:string;
  
  @Column()
  lessonId:number;


  @Column()
  userId:number;

  @OneToMany(
    () => Signupschedule,
    (signupschedule) => signupschedule.signup,{eager : true }
  )
  signupschedule: Signupschedule;

  @OneToMany(() => Payment, (payment) => payment.signup,{eager : true })
  payment: Payment;

  @OneToMany(() => Attendance, (attendance) => attendance.signup,{eager : true })
  attendances: Attendance[];

  // @Column({ type: 'date' })
  // date: string;


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
