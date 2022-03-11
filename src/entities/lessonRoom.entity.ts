import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity()
export class LessonRoom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  roomid: string;

  @OneToOne(() => User, (user) => user.lessonRoom)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;
}
