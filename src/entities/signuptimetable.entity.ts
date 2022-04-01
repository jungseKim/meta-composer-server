import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Signup } from "./signup.entity";
import { Teacher } from "./teacher.entity";
import { User } from "./user.entity";
@Entity()
export class Signuptimetable extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Signup, (signup) => signup.signuptimetables)
  signup: Signup;

  @Column()
  signupId: number;

  @Column({ type: "datetime" })
  @ApiProperty({
    example: "2022-03-17 10:40:40",
    description: "레슨이 있는 날짜와 시간",
  })
  time: string;

  @ManyToOne(() => User, (user) => user.attendances, { nullable: true })
  user: User;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.attendances, {
    nullable: true,
  })
  teacher: Teacher;

  @Column({ nullable: true })
  teacherId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  Isparticipate: boolean;
}
