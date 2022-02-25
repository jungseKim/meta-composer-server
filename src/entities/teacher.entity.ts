import { User } from './user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import { Attendance } from './attendance.entity';

@Entity()
@Unique(['id'])
export class Teacher extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => User, (user) => user.teacher)
  @JoinColumn()
  user: User;

  @Column()
  career: string;

  @Column()
  introduce: string;

  @Column()
  self_video: string;

  @OneToMany((type) => Lesson, (lesson) => lesson.teacher)
  lesson: Lesson;

  @OneToMany((type) => Attendance, (attendance) => attendance.teacher)
  attendance: Attendance;

  @Column()
  userId: number;
}
//asd