import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { User } from './user.entity';

@Entity()
@Unique(['id'])
export class LessonRoom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  roomid: string;

  @OneToOne((type) => User, (user) => user.lessonRoom)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;
}