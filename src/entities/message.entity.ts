import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatRoom } from './chatRoom.entity';
import { User } from './user.entity';

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => ChatRoom, (chatRoom) => chatRoom.messages)
  chatRoom: ChatRoom;


   @ManyToOne((type) => User, (user) => user.message)
  @JoinColumn({ name: "sender" })
  //join칼럼명 이름바꾸기1
  user : User;




  @Column({ unique: false ,name:"sender"})
                              //join 칼럼명 이름바꾸기2
  @ApiProperty({
    example:'1',
    description:'메시지 발신자 ID값'
  }) 
  sender: number;
  //이름바꾸기3

  @Column({ unique: false })
  @ApiProperty({
    example:'1',
    description:'채팅 룸 고유 ID값'
  }) 
  chatRoomId:number;


  @Column()
  @ApiProperty({
    example:'안녕나는채팅메시지',
    description:'채팅메시지 내용'
  }) 
  message:string;
}