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
// import { Attendance } from "./attendance.entity";

import { CustomNotification } from "./custom-notification.entity";

import { Lesson } from "./lesson.entity";
import { Payment } from "./payment.entity";
import { Signup } from "./signup.entity";
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
export class SignupDayAndTime extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Signup, (signup) => signup.signupDayAndTimes, {
    onDelete: "CASCADE",
  })
  signup: Promise<Signup>;

  // @Column({ type: "date" })
  // @ApiProperty({
  //   example: "2022-04-17",
  //   description: "수강이 끝나는 날짜",
  // })
  // finishdate: string;

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  signupId: number;
}
