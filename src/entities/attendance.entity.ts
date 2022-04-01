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
export class Attendance extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(() => Signup, (signup) => signup.attendances)
  signup: Signup;

  @Column({ type: "date" })
  date: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
