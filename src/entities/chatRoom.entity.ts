import { ApiProperty } from '@nestjs/swagger';
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
  //student

  @ManyToOne((type) => Lesson, (lesson) => lesson.chatRoom)
  lesson: Lesson;

  @OneToMany((type) => Message, (message) => message.chatRoom)
  messages: Message[];


  @Column({ unique: false })
  @ApiProperty({
    example:'1',
    description:'참여한 유저의 ID'
  }) 
  userId:number;

  @Column({ unique: false })
  @ApiProperty({
    example:'1',
    description:'채팅방이 해당하는 레슨의 ID'
  }) 
  lessonId : number;


}
