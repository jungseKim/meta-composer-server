import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatRoom } from './chatRoom.entity';
import { User } from './user.entity';

@Entity()
export class Message extends BaseEntity {
  @ApiProperty({ example: 1, description: '프라이머리키' })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => ChatRoom, (chatRoom) => chatRoom.messages)
  chatRoom: ChatRoom;

  @ManyToOne((type) => User, (user) => user.message)
  @JoinColumn()
  //join칼럼명 이름바꾸기1
  sender: User;

  @Column({ unique: false, name: 'senderId' })
  //join 칼럼명 이름바꾸기2
  @ApiProperty({
    example: '1',
    description: '메시지 발신자 ID값',
  })
  senderId: number;
  //이름바꾸기3

  @Column({ unique: false })
  @ApiProperty({
    example: '1',
    description: '채팅 룸 고유 ID값',
  })
  chatRoomId: number;

  @Column()
  @ApiProperty({
    example: '안녕나는채팅메시지',
    description: '채팅메시지 내용',
  })
  message: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({
    description: '읽었는지 유무',
  })
  is_read: boolean;

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
