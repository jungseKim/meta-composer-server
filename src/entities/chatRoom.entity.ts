import { type } from 'os';
import { ApiProperty } from '@nestjs/swagger';
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
import { Message } from './message.entity';
import { User } from './user.entity';
@Entity()
export class ChatRoom extends BaseEntity {
  @ApiProperty({ example: 1, description: '프라이머리키' })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.chatRoom)
  user: User;
  //student

  @ManyToOne((type) => Lesson, (lesson) => lesson.chatRooms)
  lesson: Lesson;

  @OneToMany((type) => Message, (message) => message.chatRoom)
  messages: Message[];

  @Column({ unique: false })
  @ApiProperty({
    example: '1',
    description: '참여한 유저의 ID',
  })
  userId: number;

  @Column({ unique: false })
  @ApiProperty({
    example: '1',
    description: '채팅방이 해당하는 레슨의 ID',
  })
  lessonId: number;

  @ApiProperty({
    example: '2022-03-15 10:38:40.480462',
    description: '생성날짜',
  })
  @CreateDateColumn()
  created_at: Date;
  @ApiProperty({
    example: '2022-03-15 10:38:40.480462',
    description: '업데이트 날짜',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
