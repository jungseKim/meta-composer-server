import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Attendance } from "./attendance.entity";

import { CustomNotification } from "./custom-notification.entity";

import { Lesson } from "./lesson.entity";
import { Payment } from "./payment.entity";
import { Signuptimetable } from "./signuptimetable.entity";
import { User } from "./user.entity";

export enum weekDays {
  SUN = "Sun",
  MON = "Mon",
  TUE = "Tue",
  WED = "Wed",
  THU = "Thu",
  FRI = "Fri",
  SAT = "Sat",
}

@Entity()
export class Signup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.signups)
  user: Promise<User>;

  @ManyToOne((type) => Lesson, (lesson) => lesson.signups, {
    onDelete: "CASCADE",
  })
  lesson: Promise<Lesson>;

  @ApiProperty({
    example: "merchant_12345",
    description: "수강 등록시 결제하면 자동으로 들어가는 결제고유ID",
  })
  merchant_uid: string;

  @Column()
  @ApiProperty({
    example: 1,
    description: "수강 등록할 레슨의 ID",
  })
  lessonId: number;

  @Column()
  @ApiProperty({
    example: 1,
    description: "수강 등록하는 유저의 ID",
  })
  userId: number;

  @Column({ type: "date" })
  @ApiProperty({
    example: "2022-03-17",
    description: "수강이 시작하는 날짜",
  })
  startdate: string;

  // @Column({ type: "date" })
  // @ApiProperty({
  //   example: "2022-04-17",
  //   description: "수강이 끝나는 날짜",
  // })
  // finishdate: string;

  @Column()
  @ApiProperty({
    example: "5",
    description: "수강 신청 개월수",
  })
  howManyMonth: number;

  @Column({ type: "enum", enum: weekDays })
  @ApiProperty({
    example: weekDays.MON,
    description: "사용자가 수강 신청한 요일",
  })
  weekdays: string;

  @Column({ type: "time" })
  @ApiProperty({
    example: "11:30:00",
    description: "사용자가 수강 신청한 시간",
  })
  lessonTime: string;

  @OneToMany(
    () => Signuptimetable,
    (signuptimetables) => signuptimetables.signup,
    {
      eager: true,
    },
  )
  signuptimetables: Signuptimetable[];

  @OneToOne(() => Payment, (payment) => payment.signup, {})
  payment: Payment;

  @OneToMany(() => Attendance, (attendance) => attendance.signup, {
    eager: true,
  })
  attendances: Attendance[];

  // @Column({ type: 'date' })
  // date: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
