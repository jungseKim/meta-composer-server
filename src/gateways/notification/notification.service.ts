import { Lesson } from "./../../entities/lesson.entity";
import { Signup, weekDays } from "src/entities/signup.entity";
import { createQueryBuilder } from "typeorm";
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import console from "console";
import * as jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { TokenPayload } from "src/modules/auth/token-payload.interface";
import { ChatRoom } from "src/entities/chatRoom.entity";
import { Message } from "src/entities/message.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { CustomNotification } from "src/entities/custom-notification.entity";
@Injectable()
export class NotificationService {
  clients: Record<number, Socket>;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CustomNotification)
    private CustomnotificationRepository: Repository<CustomNotification>,
    @InjectRepository(Signup)
    private signupRepository: Repository<Signup>,
  ) {
    this.clients = {};
  }

  public async auth(client: Socket): Promise<ChatRoom[]> {
    const authToken = client.handshake.auth.token?.split(" ")[1];
    // const authToken = client.handshake.headers.authorization?.split(' ')[1];
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
  }

  public disconnection(client: Socket) {
    const userId: number = client.data.userId;
    delete this.clients[userId];
  }

  // 채팅은 알림 저장할 필요가 없음
  public async pushMessage(userId: number, message: Message) {
    const client = this.clients[userId];
    client?.emit("push-message", message);
  }
  //-----------------controller----------------------------
  public async getNotifitions(user: User, page: number, perPage: number) {
    const userId = user.id;

    return await this.CustomnotificationRepository.createQueryBuilder("noti")
      .where("noti.userId = :userId", {
        userId,
      })
      .orderBy("message.created_at", "DESC")
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }

  public async getNotifitionInfo(notiId: number) {
    // return await this.CustomnotificationRepository.createQueryBuilder("noti")
    // .where('noti.uotiId = :notiId',{
    //   notiId
    // }).innerJoinAndSelect('noti.user','user')
    // .
  }
  public async pushStarClass(signup: Signup) {
    const userId = signup.userId;
    const teacherUserId = (await signup.lesson.teacher).userId;

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
  public async test() {
    const signup = await this.signupRepository.create({});
    const userId = signup.userId;
    const teacherUserId = (await signup.lesson.teacher).userId;
    console.log(userId, teacherUserId);
  }
}
