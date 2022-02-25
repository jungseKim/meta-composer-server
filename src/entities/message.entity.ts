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
  @ManyToOne((type) => ChatRoom, (chatRoom) => chatRoom.message)
  chatRoom: ChatRoom;

  @Column()
  fromWho: string;

  @Column()
  message: string;
}
//