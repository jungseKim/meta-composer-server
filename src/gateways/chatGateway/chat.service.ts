import { find } from 'rxjs';
import { Lesson } from './../../entities/lesson.entity';
import { Teacher } from './../../entities/teacher.entity';
import { Socket } from 'socket.io';
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Repository, QueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as jwt from 'jsonwebtoken';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { ChatRoom } from 'src/entities/chatRoom.entity';
import { Message } from 'src/entities/message.entity';
import { MAX } from 'class-validator';
import ChatList from 'src/types/ChatList';
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  //--------------------gateWay------------------------------
  public async auth(client: Socket): Promise<ChatRoom[]> {
    const authToken = client.handshake.auth.token.split(' ')[1];

    if (!authToken) {
      client.disconnect();
      return;
    }

    const jwtPayload: TokenPayload = <TokenPayload>(
      jwt.verify(authToken, process.env.JWT_SECRET)
    );

    const user = await this.userRepository.findOne(jwtPayload['userId']);
    if (!user) {
      client.disconnect();
      return;
    }

    client.data.userId = user.id;
  }
  public async chatRoomJoin(client: Socket, roomId: number) {
    const userId: number = client.data.userId;
    const room = await this.chatRoomRepository.findOne(roomId);
    const messages = await this.messageRepository.find(room);
    messages.forEach(async (msg) => {
      if (msg.senderId !== userId && !msg.is_read) {
        msg.is_read = true;
        await msg.save();
      }
    });
    client.data.currentRoomId = room.id;
    client.join(room.id.toString());
  }

  public async saveMessage(userId: number, roomId: number, message: string) {
    await this.messageRepository
      .create({
        senderId: userId,
        message,
        chatRoomId: roomId,
      })
      .save();
  }

  //---------------------controller----------------------
  public async getChatRoomMeesage(id: number, page: number) {
    return await this.messageRepository
      .createQueryBuilder('message')
      .innerJoin('message.chatRoom', 'chatRoom', 'chatRoom.id = :id', {
        id,
      })
      .orderBy('message.createdAt', 'DESC')
      .take(10)
      .skip(10 * (page - 1))
      .getMany();
  }

  public async getRoomList(user: User) {
    const userChatList = await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .where('chatRoom.userId = :id', { id: user.id })
      .leftJoinAndSelect('chatRoom.messages', 'messages')
      .orderBy('messages.created_at', 'DESC')
      .limit(1)
      .getMany();

    const teacher = await this.teacherRepository.findOne(user.id);

    if (teacher) {
      const lessonChat = await this.lessonRepository
        .createQueryBuilder('lesson')
        .innerJoin('lesson.teacher', 'teacher', 'teacher.id = :id', {
          id: user.id,
        })
        .innerJoinAndSelect('lesson.chatRooms', 'chatRooms')
        .leftJoinAndSelect('chatRooms.messages', 'messages')
        .orderBy('messages.created_at', 'DESC')
        .limit(1)
        .getMany();

      const chatList: ChatList = { lessonChat, userChatList };
      return chatList;
    }

    const chatList: ChatList = { lessonChat: null, userChatList };
    return chatList;
  }
}
