import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import { User } from './user.entity';

export enum Rating {
  ONE = 1,
  ONE_POINT_FIVE = 1.5,
  TWO = 2,
  TWO_POINT_FIVE = 2.5,
  THREE = 3,
  THREE_POINT_FIVE = 3.5,
  FOUR = 4,
  FOUR_POINT_FIVE = 4.5,
  FIVE = 5,
}

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Lesson, (lesson) => lesson.comments)
  lesson: Lesson;

  @Column()
  contents: string;

  @Column({ type: 'enum', enum: Rating })
  rating: Rating;

  @Column()
  userId:number
  @Column()
  lessonId:number


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
