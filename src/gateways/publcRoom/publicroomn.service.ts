import { RedisCacheService } from 'src/cache/rediscache.service';
import { Socket } from 'socket.io';
import { RedisCacheModule } from 'src/cache/rediscache.module';
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';
import { UAParser } from 'ua-parser-js';
import { nanoid } from 'nanoid';
import { Room } from 'src/types/redis';
import e from 'express';

@Injectable()
export class PublicRoomnService {
  constructor(private RedisCacheService: RedisCacheService) {
    this.check = true;
  }
  check: boolean;
  public async auth(client: Socket): Promise<void> {
    const token = client.handshake.auth.token.split(' ')[1];
    const userId = await this.RedisCacheService.getUser(token);

    const agent = new UAParser(client.handshake.headers['user-agent']);
    const check = agent.getBrowser().name === 'Oculus Browser' ? true : false;
    console.log(token, userId, check);
    if (!token || !userId || check) {
      client.disconnect();
      return;
    }

    client.data.userId = userId;
  }

  public async create(
    id: string,
    client: Socket,
    roomId: string,
    title: string,
  ): Promise<void> {
    await this.RedisCacheService.addRoom(id, roomId, client.data.userId, title);
  }

  public async leaveRoom(client: Socket, roomId: string): Promise<void> {
    await this.RedisCacheService.removeRoom(client.data.userId);
    client.leave(roomId);
  }
  public async existRoom(userId: string): Promise<Room> {
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
      client.to(existRoom.roomId).to('RoomRemove');
    }
    const token = client.handshake.auth.token.split(' ')[1];
    await this.RedisCacheService.removeUser(token);
    await this.RedisCacheService.removeRoom(client.data.userId);
  }

  public async roomList() {
    return await this.RedisCacheService.roomList();
  }

  public async joinRoom(
    client: Socket,
    roomId: string,
  ): Promise<boolean | Room> {
    const roomList = await this.RedisCacheService.privateRooms();
    const room = roomList.find((room) => {
      if (room.id === roomId) {
        return room;
      }
    });
    if (room.onAir) {
      await this.RedisCacheService.roomStateChage(roomId, client.data.userId);
      // client.join(roomId);
      // client.to(roomId).emit('sendOffer');
      return room;
    } else {
      return false;
    }
  }
}
