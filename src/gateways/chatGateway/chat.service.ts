import { find } from 'rxjs';
import { Lesson } from './../../entities/lesson.entity';
import { Teacher } from './../../entities/teacher.entity';
import { Socket } from 'socket.io';
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as jwt from 'jsonwebtoken';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { ChatRoom } from 'src/entities/chatRoom.entity';
import { Message } from 'src/entities/message.entity';
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

    client.data.userId = user.id;

    const userChatList = await this.chatRoomRepository.find(user);

    userChatList.forEach((room) => {
      const roomId: number = room.id;
      client.join(roomId.toString());
    });

    for (const chatRoom of userChatList) {
      const message = await chatRoom.messages;
    }
    userChatList;

    const teacher = await this.teacherRepository.findOne(user);

    if (teacher) {
      const lessons = await this.lessonRepository.find(teacher);

      const lessonChatRooms = [];

      lessons.map(async (lesson) => {
        return await this.chatRoomRepository.find(lesson);
      });
      lessons.forEach((lesson) => {
        this.chatRoomRepository.find(lesson);
      });

      const teacherChatList = await this.chatRoomRepository.find(lesson);
      teacherChatList.forEach((room) => {
        const roomId: number = room.id;
        client.join(roomId.toString());
      });

      userChatList.concat(teacherChatList);
    }

    return userChatList;
  }

  public async chatJoin(userId: number, roomId: string) {
    // const user = await this.userRepository.findOne(userId);
    const chatRoom: ChatRoom = await this.chatRoomRepository.findOne(roomId);
    const messages: Message[] = await chatRoom.messages;

    messages.forEach((msg) => {
      if (msg.fromWho !== userId) {
        msg.read = true;
        this.messageRepository.save(msg);
      }
    });
  }

  public async saveMessage(room: ChatRoom, message: string, userId: number) {
    // const room=  await this.chatRoomRepository.findOne(roomId);
    this.messageRepository.create({
      chatRoom: room,
      fromWho: userId,
    });
  }
}
