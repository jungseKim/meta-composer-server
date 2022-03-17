import { find } from "rxjs";
import { Lesson } from "./../../entities/lesson.entity";
import { Teacher } from "./../../entities/teacher.entity";
import { Socket } from "socket.io";
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { Repository, QueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import * as jwt from "jsonwebtoken";
import { ChatRoom } from "src/entities/chatRoom.entity";
import { Message } from "src/entities/message.entity";
import { MAX } from "class-validator";
import ChatList from "src/types/ChatList";
import { NotificationService } from "src/gateways/notification/notification.service";
import { Signup } from "src/entities/signup.entity";
import { TokenPayload } from "src/modules/auth/token-payload.interface";
import { SendMessageDto } from "./dto/send-message.dto";
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
    @InjectRepository(Signup)
    private signupRepository: Repository<Signup>,
    private notificationService: NotificationService,
  ) {}

  //실시간 알람은 notification service에서 다 처리 = 여기서 이벤트 바인딩 할필요 없음

  public async chatRoomJoin(userId: number, roomId: number) {
    const room = await this.chatRoomRepository.findOne(roomId);

    const messages = await room.messages;
    console.log({ messages });
    messages.forEach(async (msg) => {
      if (msg.senderId !== userId && !msg.is_read) {
        msg.is_read = true;
        await msg.save();
      }
    });
  }

  public async saveMessage(user: User, sendMessage: SendMessageDto) {
    const senderId = user.id;
    const message = sendMessage.message;
    const chatRoomId = sendMessage.roomId;

    const chatRoom = await this.chatRoomRepository.findOneOrFail(chatRoomId);
    if (!chatRoom) {
      return false;
    }
    const messageSend = await this.messageRepository
      .create({
        senderId,
        message,
        chatRoomId,
      })
      .save();

    if (chatRoom.userId === senderId) {
      const lesson = await chatRoom.lesson;
      const teacher = await lesson.teacher;
      this.notificationService.pushMessage(teacher.userId, messageSend);
    } else {
      this.notificationService.pushMessage(senderId, messageSend);
    }
    return messageSend;
  }

  public async getChatRoomMeesage(
    roomId: number,
    page: number,
    perPage: number,
  ) {
    return await this.messageRepository
      .createQueryBuilder("message")
      .where("message.chatRoomId = :roomId", {
        roomId,
      })
      .orderBy("message.created_at", "DESC")
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }

  public async getRoomList(user: User) {
    const userChatList = await this.chatRoomRepository
      .createQueryBuilder("chatRoom")
      .where("chatRoom.userId = :id", { id: user.id })
      .innerJoinAndSelect("chatRoom.lesson", "lesson")
      .innerJoinAndSelect("lesson.teacher", "teacher")
      .leftJoinAndSelect("chatRoom.messages", "messages")
      .orderBy("messages.created_at", "DESC")
      .limit(1)
      .getMany();

    const teacher = await this.teacherRepository.findOne(user.id);

    if (teacher) {
      const lessonChat = await this.lessonRepository
        .createQueryBuilder("lesson")
        .innerJoin("lesson.teacher", "teacher", "teacher.id = :id", {
          id: user.id,
        })
        .innerJoinAndSelect("lesson.chatRooms", "chatRooms")
        .innerJoinAndSelect("chatRooms.user", "user")
        .leftJoinAndSelect("chatRooms.messages", "messages")
        .orderBy("messages.created_at", "DESC")
        .limit(1)
        .getMany();

      const chatList: ChatList = { lessonChat, userChatList };
      return chatList;
    }

    const chatList: ChatList = { lessonChat: null, userChatList };
    return chatList;
  }

  public async getChatRoomInfo(user: User, roomId: number) {
    await this.chatRoomJoin(user.id, roomId);

    const room = await this.chatRoomRepository
      .createQueryBuilder("room")
      .where("room.id = :roomId", { roomId })
      .leftJoinAndSelect("room.user", "user")
      .leftJoinAndSelect("room.lesson", "lesson")
      .getOne();
    return room;
  }

  public async createChatRoom(userId: number, lessonId: number) {
    const chatRoom = await this.chatRoomRepository.findOneOrFail({
      userId,
      lessonId,
    });
    if (chatRoom) {
      return chatRoom;
    } else {
      if (!(await this.signupRepository.findOneOrFail({ userId, lessonId }))) {
        return "수강 한 학생들만 채팅신청을 할수 있습니다";
      }
      return await this.chatRoomRepository
        .create({
          userId,
          lessonId,
        })
        .save();
    }
  }
}
