import { Lesson } from "./../../entities/lesson.entity";
import { Signup, weekDays } from "src/entities/signup.entity";
import { createQueryBuilder, getConnection } from "typeorm";
/*
https://docs.nestjs.com/providers#services
*/

import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import console, { timeStamp } from "console";
import * as jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { TokenPayload } from "src/modules/auth/token-payload.interface";
import { ChatRoom } from "src/entities/chatRoom.entity";
import { Message } from "src/entities/message.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { CustomNotification } from "src/entities/custom-notification.entity";
import { TasksService } from "src/modules/tasks/tasks.service";
import { NotificationSocekt } from "../custom-sockets/my-socket";
import { WsException } from "@nestjs/websockets";
@Injectable()
export class NotificationService {
  clients: Record<number, Socket>;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CustomNotification)
    private CustomnotificationRepository: Repository<CustomNotification>,
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
  ) {
    this.clients = {};
  }

  public async auth(client: NotificationSocekt): Promise<ChatRoom[]> {
    const authToken = client.handshake.auth.token?.split(" ")[1];
    // const authToken = client.handshake.headers.authorization?.split(" ")[1];
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
    this.clients[user.id] = client;
    client.userId = user.id;
  }

  public disconnection(client: NotificationSocekt) {
    const userId = client.userId;
    delete this.clients[userId];
    if (client.chatRoomId) {
      client.to(`chat-room-${client.chatRoomId}`).emit("chatLeave-event");
    }
  }

  // 채팅은 알림 저장할 필요가 없음
  public async pushMessage(userId: number, message: Message) {
    const client = this.clients[userId];

    client?.emit("push-message", message);
  }

  public async getNotifitions(user: User, page: number, perPage: number) {
    const userId = user.id;
    console.log(userId);

    //안읽은게 먼저, 최근께 먼저
    const notifitionData =
      await this.CustomnotificationRepository.createQueryBuilder("noti")
        .where("noti.userId = :userId", {
          userId,
        })
        .leftJoinAndSelect("noti.signup", "signup")
        .leftJoinAndSelect("signup.user", "user")
        .orderBy("noti.readTime")
        .addOrderBy("noti.created_at", "DESC")
        .take(perPage)
        .skip(perPage * (page - 1))
        .getMany();
    const notifitionCount = await this.CustomnotificationRepository.count({
      userId: userId,
    });
    return { notifitionData, notifitionCount };
  }

  public async getNotifitionInfo(user: User, notiId: number) {
    //읽음 처리
    const notification = await this.CustomnotificationRepository.findOne(
      notiId,
    );
    if (notification.userId !== user.id) {
      throw new ForbiddenException();
    }
    if (!notification) {
      return "empty not";
    }
    notification.readTime = new Date().toDateString();
    await notification.save();

    //여기서 레프트 조인 계속 하면됨
    return await this.CustomnotificationRepository.createQueryBuilder("noti")
      .where("noti.Id = :notiId", {
        notiId,
      })
      .leftJoinAndSelect("noti.signup", "signup")
      .getOne();
  }
  public async pushStarClass(signup: Signup) {
    const userId = signup.userId;
    const teacherUserId = await (await (await signup.lesson).teacher).userId;
    console.log(teacherUserId);
    const studentNotification = await this.CustomnotificationRepository.create({
      signupId: signup.id,
      userId,
    }).save();
    const teacherNotification = await this.CustomnotificationRepository.create({
      signupId: signup.id,
      userId: teacherUserId,
    }).save();

    const user = this.clients[userId];
    user?.emit("push-start-class", studentNotification);
    const teacher = this.clients[teacherUserId];
    teacher?.emit("push-start-class", teacherNotification);
  }

  public async deleteNotification(user: User, notiId: number) {
    const notification = await this.CustomnotificationRepository.findOne(
      notiId,
    );
    if (notification.userId !== user.id) {
      throw new ForbiddenException();
    }
    await this.CustomnotificationRepository.delete(notiId);
    return notification;
  }

  public async chatRoomJoin(client: NotificationSocekt, roomId: number) {
    const userId: number = client.userId;

    const room = await this.chatRoomRepository.findOne(roomId);
    if (!room) throw new WsException("없는방입니다");
    const teaherid = (await (await room.lesson).teacher).userId;

    if (room.userId !== userId && teaherid !== userId) {
      throw new WsException("방참가 인원이 아닙니다");
    }
    await getConnection()
      .createQueryBuilder()
      .update(Message)
      .set({ is_read: true })
      .where("senderId != :id", { id: userId })
      .andWhere("chatRoomId = :id", { id: roomId })
      .execute();
    client.to(`chat-room-${client?.chatRoomId}`).emit("chatLeave-event");
    client.rooms.clear();

    client.chatRoomId = roomId;

    client.join(`chat-room-${room.id}`);
    client.to(`chat-room-${room.id}`).emit("chatJoin-event");
  }
}
