import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Lesson } from "./lesson.entity";
import { Signup } from "./signup.entity";

export enum Day {
  SUN = "Sun",
  MON = "Mon",
  TUE = "Tue",
  WED = "Wed",
  THU = "Thu",
  FRI = "Fri",
  SAT = "Sat",
}

@Entity()
export class TimeTable extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Lesson, (lesson) => lesson.timeTables)
  lesson: Lesson;

  @Column()
  lessonId: number;

  @Column({ type: "enum", enum: Day })
  day: Day;
  //enum?

  @OneToOne(() => Signup, (signup) => signup.timetable, { eager: true })
  @JoinColumn()
  signup: Promise<Signup>;

  @Column({ default: null })
  signupId: number;

  // @Column({ default: true })
  // IsEmpty: boolean;

  @Column({ type: "time" })
  time: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
