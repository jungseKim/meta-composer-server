import { Message } from "./../../entities/message.entity";
import { WsException } from "@nestjs/websockets";
import { find } from "rxjs";
import { Lesson } from "./../../entities/lesson.entity";
import { Teacher } from "./../../entities/teacher.entity";
import { Socket } from "socket.io";
/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Injectable } from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { Repository, QueryBuilder, getConnection } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import * as jwt from "jsonwebtoken";
import { ChatRoom } from "src/entities/chatRoom.entity";
import { MAX } from "class-validator";
import ChatList, { CustomChatRoom } from "src/types/ChatList";
import { NotificationService } from "src/gateways/notification/notification.service";
import { Signup } from "src/entities/signup.entity";
import { TokenPayload } from "src/modules/auth/token-payload.interface";
import { SendMessageDto } from "./dto/send-message.dto";
import { ChatSocekt } from "../custom-sockets/my-socket";
import { query } from "express";
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
  public async auth(client: ChatSocekt) {
    // const authToken = client.handshake.auth.token?.split(" ")[1];
    const authToken = client.handshake.headers.authorization?.split(" ")[1];
    if (!authToken) {
      client.disconnect();
      return;
    }

    const jwtPayload: TokenPayload = <TokenPayload>(
      jwt.verify(authToken, process.env.JWT_SECRET)
    );

    const user = await this.userRepository.findOne(jwtPayload["userId"]);
    if (!user) {
      client.disconnect();
      return;
    }

    client.rooms.clear();
    client.userId = user.id;
  }

  public async chatRoomJoin(client: ChatSocekt, roomId: number) {
    const userId = client.userId;

    const room = await this.chatRoomRepository.findOneOrFail(roomId);
    const teaherid = (await (await room.lesson).teacher).userId;
    if (!room || (room.userId !== userId && teaherid !== userId)) {
      throw new WsException("방참가 인원이 아닙니다");
    }
    await getConnection()
      .createQueryBuilder()
      .update(Message)
      .set({ is_read: true })
      .where("senderId != :id", { id: userId })
      .andWhere("chatRoomId = :id", { id: roomId })
      .execute();

    client.to(client.chatRoomId?.toString()).emit("chatLeave-event");
    client.rooms.clear();

    client.chatRoomId = roomId;

    client.join(room.id.toString());
    client.to(room.id.toString()).emit("chatJoin-event");
  }

  public async saveMessage(
    user: User,
    chatRoomId: number,
    sendMessage: SendMessageDto,
    image,
  ) {
    const senderId = user.id;
    const is_read = sendMessage.is_read;

    const chatRoom = await this.chatRoomRepository.findOneOrFail(chatRoomId);
    if (!chatRoom) {
      return false;
    }
    const messageSend = await this.messageRepository.create({
      sender: user, //여기에 객체 넣으면 자동을 eger  로딩됨 야발 ㅋㅋ
      message: sendMessage?.message,
      chatRoomId,
      is_read,
    });

    if (image) {
      messageSend.image = image.filename;
    }
    messageSend.save();

    if (chatRoom.userId === senderId) {
      const lesson = await chatRoom.lesson;
      const teacher = await lesson.teacher;
      this.notificationService.pushMessage(teacher.userId, messageSend);
    } else {
      this.notificationService.pushMessage(chatRoom.userId, messageSend);
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
      .innerJoinAndSelect("teacher.user", "user")
      // .leftJoinAndSelect("chatRoom.messages", "messages")
      // .leftJoinAndSelect(
      //   (subQuery) => {
      //     return subQuery
      //       .select()
      //       .from(Message, "message")
      //       .orderBy({ "message.created_at": "DESC" })
      //       .limit();
      //   },
      //   "message",
      //   "message.chatRoomId = chatRoom.id",
      // )
      .loadRelationCountAndMap(
        "chatRoom.unReadCount",
        "chatRoom.messages",
        "unreadMessageCount",
        (qb) =>
          qb
            .where("unreadMessageCount.is_read = false")
            .andWhere("unreadMessageCount.senderId != :id", { id: user.id }),
      )
      // .limit(1)
      .getMany();
    //get entrise

    const teacher = await this.teacherRepository.findOne({ userId: user.id });

    if (teacher) {
      const lessonChat = await this.lessonRepository
        .createQueryBuilder("lesson")
        .innerJoin("lesson.teacher", "teacher", "teacher.id = :id", {
          id: teacher.id,
        })
        .innerJoinAndSelect("lesson.chatRooms", "chatRooms")
        .innerJoinAndSelect("chatRooms.user", "user")
        // .leftJoinAndSelect("chatRooms.messages", "messages")
        .loadRelationCountAndMap(
          "chatRooms.unReadCount",
          "chatRooms.messages",
          "unreadMessageCount",
          (qb) =>
            qb
              .where("unreadMessageCount.is_read = false")
              .andWhere("unreadMessageCount.senderId != :id", { id: user.id }),
        )
        .getMany();

      const chatList: ChatList = { lessonChat, userChatList };
      return chatList;
    }

    const chatList: ChatList = { lessonChat: [], userChatList };
    return chatList;
  }

  public async getChatRoomInfo(user: User, roomId: number) {
    // await this.chatRoomJoin(user.id, roomId);

    const room = await this.chatRoomRepository
      .createQueryBuilder("room")
      .where("room.id = :roomId", { roomId })
      .leftJoinAndSelect("room.user", "user")
      .leftJoinAndSelect("room.lesson", "lesson")
      .getOne();
    return room;
  }

  public async createChatRoom(userId: number, lessonId: number) {
    const chatRoom = await this.chatRoomRepository.findOne({
      userId,
      lessonId,
    });
    if (chatRoom) {
      return chatRoom;
    }
    // } else {
    //   if (!(await this.signupRepository.findOneOrFail({ userId, lessonId }))) {
    //     throw new HttpException("수강한 학생들만 채팅신청 가능", 402);
    //   }
    return await this.chatRoomRepository
      .create({
        userId,
        lessonId,
      })
      .save();
    // }
  }
  public async removeChatRoom(user: User, roomId: number) {
    const room = await this.chatRoomRepository.findOne({ id: roomId });
    if (!room) throw new HttpException("채팅방이 없음", 402);
    const lesson = await room.lesson;
    const teacher = await lesson.teacher;

    if (room.userId !== user.id && teacher.userId !== user.id) {
      throw new HttpException("채팅방에 속해있지않음", 402);
    }
    return await this.chatRoomRepository.delete({ id: roomId });
  }
}
