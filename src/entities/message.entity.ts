import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatRoom } from './chatRoom.entity';

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => ChatRoom, (chatRoom) => chatRoom.messages)
  chatRoom: ChatRoom;

  @Column()
  fromWho: number;

  @Column()
  message: string;

  @Column({ default: false })
  read: boolean;
}
