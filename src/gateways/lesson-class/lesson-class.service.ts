import { Lesson } from "./../../entities/lesson.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Socket } from "socket.io";
import { Attendance } from "./../../entities/attendance.entity";
import { Signup } from "./../../entities/signup.entity";
import { RedisCacheService } from "./../../cache/rediscache.service";
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from "@nestjs/common";
import { nanoid } from "nanoid";
import { LessonAttendanceDto } from "src/types/lesson-class";
import { Repository } from "typeorm";
import { Signuptimetable } from "src/entities/signuptimetable.entity";
import { LessonSocket } from "../custom-sockets/my-socket";
import { TokenPayload } from "src/modules/auth/token-payload.interface";
import { User } from "src/entities/user.entity";

import { UAParser } from "ua-parser-js";
import { WsException } from "@nestjs/websockets";
import * as jwt from "jsonwebtoken";
@Injectable()
export class LessonClassService {
  constructor(
    private redisCacheService: RedisCacheService,
    @InjectRepository(Signuptimetable)
    private signuptimetableRepository: Repository<Signuptimetable>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async setInit(client: LessonSocket, lessonId: number) {
    // const authToken = client.handshake.auth.token?.split(" ")[1];
    const authToken = client.handshake.headers.authorization?.split(" ")[1];
    const jwtPayload: TokenPayload = <TokenPayload>(
      jwt.verify(authToken, process.env.JWT_SECRET)
    );

    const user = await this.userRepository.findOne(jwtPayload["userId"]);
    // const userId = await this.redisCacheService.getUser(authToken);
    // const agent = new UAParser(client.handshake.headers["user-agent"]);
    // const check = agent.getBrowser().name === "Oculus Browser" ? true : false;
    if (!authToken || user === null) {
      return client.disconnect();
    }

    client.rooms.clear();
    client.userId = user.id;

    //원래 이걸로
    // return this.LessonConnection(client, lessonId);
    return this.TestLessonConnection(client, lessonId);
  }

  public async clasStart(signup: Signup, signuptimetableId: number) {
    const userId = (await signup.user).id;
    const teacherId = (await (await signup.lesson).teacher).userId;
    console.log(userId, teacherId);
    const attendanceDto: LessonAttendanceDto = {
      userId,
      teacherId,
      signuptimetableId,
    };
    //레디스 사용 하지 말고 그냥 디비 사용하자
    await this.redisCacheService.addLessonRoom(signup.id, attendanceDto);
  }

  public async LessonConnection(client: LessonSocket, signupId: number) {
    const attendanceDto = await this.redisCacheService.getLessonRoom(signupId);
    if (attendanceDto === null || !attendanceDto) {
      throw new WsException("수업 시작 전이거나 없는 방입니다");
    }
    const tiemTable = await this.signuptimetableRepository.findOne(
      attendanceDto.signuptimetableId,
    );
    if (
      client.userId !== attendanceDto.userId &&
      client.userId !== attendanceDto.teacherId
    ) {
      throw new WsException("방참가 권한이 없습니다");
    }
    if (client.userId === attendanceDto.userId) {
      tiemTable.userId = client.userId;
    } else if (client.userId === attendanceDto.teacherId) {
      tiemTable.teacherId = client.data.userId;
    }
    await tiemTable.save();
    client.join(`lesson-${signupId}`);
    client.to(`lesson-${signupId}`).emit("sendOffer");
  }
  public async TestLessonConnection(client: LessonSocket, lessonId: number) {
    client.join(`lesson-${lessonId}`);
    client.to(`lesson-${lessonId}`).emit("sendOffer");
  }
}
