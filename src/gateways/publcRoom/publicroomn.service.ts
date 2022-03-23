import { WsException } from "@nestjs/websockets";
import { RedisCacheService } from "src/cache/rediscache.service";
import { Server, Socket } from "socket.io";
import { RedisCacheModule } from "src/cache/rediscache.module";
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from "@nestjs/common";
import { registerEnumType } from "@nestjs/graphql";
import { UAParser } from "ua-parser-js";
import { nanoid } from "nanoid";
import { PublicRoom } from "src/types/public-room";
import e from "express";
import { LessonSocket } from "../custom-sockets/my-socket";

@Injectable()
export class PublicRoomnService {
  constructor(private RedisCacheService: RedisCacheService) {
    this.check = true;
  }
  check: boolean;

  public async auth(client: LessonSocket): Promise<void> {
    // const token = client.handshake.auth?.token?.split(" ")[1];
    const token = client.handshake.headers.authorization?.split(" ")[1];
    const userId = await this.RedisCacheService.getUser(token);
    console.log(userId);

    const agent = new UAParser(client.handshake.headers["user-agent"]);
    const check = agent.getBrowser().name === "Oculus Browser" ? true : false;
    console.log(token, userId, check);
    if (!token || !userId || check) {
      client.disconnect();
      return;
    }

    client.userId = userId;

    console.log("dddd", client.data.userId);
  }

  public async create(
    client: Socket,
    title: string,
    server: Server,
  ): Promise<PublicRoom | boolean> {
    const exist = await this.existRoom(client.data.userId);
    if (exist) {
      throw new WsException("이미 참가하고있는방 있습니다");
    }

    const roomId = nanoid(10);
    const id = nanoid(5);
    const room = await this.RedisCacheService.addRoom(
      id,
      roomId,
      client.data.userId,
      title,
    );
    await this.roomListchange(server);
    return room;
  }

  public async leaveRoom(
    client: Socket,
    roomId: string,
    server: Server,
  ): Promise<void> {
    await this.RedisCacheService.removeRoom(client.data.userId);
    client.leave(roomId);
    await this.roomListchange(server);
  }

  public async existRoom(userId: string): Promise<PublicRoom> {
    const roomList = await this.RedisCacheService.privateRooms();

    const existRoom = roomList.find((room) => {
      if (room.userId === userId || room.onAir === userId) {
        return room;
      }
    });
    return existRoom;
  }

  public async leaveUser(client: Socket): Promise<void> {
    const id = client.data.userId;
    const existRoom = await this.existRoom(id);

    if (existRoom && existRoom.userId === id) {
      client.to(existRoom.roomKey).to("RoomRemove");
    }
    // const token = client.handshake.auth?.token?.split(" ")[1];

    const token = client.handshake.headers.authorization?.split(" ")[1];
    await this.RedisCacheService.removeUser(token);
    await this.RedisCacheService.removeRoom(client.data.userId);
  }

  public async roomList() {
    return await this.RedisCacheService.roomList();
  }

  public async joinRoom(
    client: LessonSocket,
    roomId: string,
    server: Server,
  ): Promise<PublicRoom> {
    console.log("dddd", client.data.userId);
    const exist = await this.existRoom(client.data.userId);
    if (exist) {
      throw new WsException("There's a room that's already participating.");
    }

    const roomList = await this.RedisCacheService.privateRooms();

    const room = roomList.find((room) => {
      if (room.id === roomId) {
        return room;
      }
    });

    if (room && room.onAir) {
      await this.RedisCacheService.roomStateChage(roomId, client.data.userId);
      //여기서는 룸 key 가 담긴 room정보만 줌
      // client.join(roomId);
      // client.to(roomId).emit("sendOffer");
      await this.roomListchange(server);
      return room;
    } else {
      throw new WsException("The room is not on standby.");
    }
  }

  public async roomListchange(server: Server) {
    const roomList = await this.roomList();
    console.log("public roomList", roomList);
    server.emit("listChange", roomList);
  }
}
