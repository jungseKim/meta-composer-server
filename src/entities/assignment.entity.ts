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
import { Sheet } from './sheet.entity';
import { User } from './user.entity';

@Entity()
export class Assignment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.assignment)
  user: User;

  @ManyToOne((type) => Lesson, (lesson) => lesson.assignment)
  lesson: Lesson;

  @Column({ type: 'datetime' })
  startedTime: number;

  @Column({ type: 'datetime' })
  endTime: number;

  @Column()
  contents: string;

  @Column()
  title: string;

  @Column({ type: 'boolean' })
  isFinished: boolean;

  @Column()
  accuracy: number;

  @Column({ type: 'time' })
  time_length: number;

  @Column()
  finished_times: number;

  //
  @OneToMany((type) => Sheet, (sheet) => sheet.assignment)
  sheet: Sheet;


  @Column()
  userId : number;
  @Column()
  lessonId : number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}
