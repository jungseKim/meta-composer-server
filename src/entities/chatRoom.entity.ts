import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity()
export class ChatRoom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.chatRoom)
  user: User;

  @ManyToOne((type) => Lesson, (lesson) => lesson.chatRoom)
  lesson: Lesson;

  @OneToMany((type) => Message, (message) => message.chatRoom)
  message: Message;
}
