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

    client.data.user = user;
  }

  public async saveMessage(user: User, room: ChatRoom, message: string) {
    this.messageRepository.create({
      user,
      sender: user.id,
      message,
      chatRoomId: room.id,
    });
  }

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
    const teacher = await this.teacherRepository.findOne(user);
    const chatList = {};
    if (teacher) {
      const lessonChat = await this.lessonRepository
        .createQueryBuilder('lesson')
        .innerJoin('lesson.teacher', 'teacher', 'teacher.id = :id', {
          id: user.id,
        })
        .innerJoinAndSelect('lesson.chatRooms', 'chatRooms')
        .getMany();

      chatList['lessonChat'] = lessonChat;
    }
    const userChatList = await this.chatRoomRepository
      .createQueryBuilder('chatRoom')
      .where('chatRoom.userId = :id', { id: user.id })
      // .innerJoinAndSelect('chatRoom.messages', 'messages')
      // .skip(10)
      // .take(10)
      // .where('messages.createdAt = MAX(messages.createdAt)')
      .getMany();
    chatList['userChatList'] = userChatList;

    return chatList;
  }
}
