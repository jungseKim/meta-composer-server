import { Room } from './../types/redis';
/*
https://docs.nestjs.com/providers#services
*/

import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { timingSafeEqual } from 'crypto';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {
    this.cache.set('roomList', []);
  }

  public async addUser(key: string, value: string): Promise<void> {
    await this.cache.set(key, value, {
      ttl: 60 * 60 * 1000,
    });
    console.log('저장');
  }

  public async getUser(key: string): Promise<string> {
    const redisValue: string = await this.cache.get(key);
    console.log('꺼냄');
    return redisValue;
  }

  public async removeUser(key: string): Promise<void> {
    await this.cache.del(key);
    console.log('삭제');
  }

  public async privateRooms(): Promise<Room[]> {
    return this.cache.get('roomList');
  }

  public async addRoom(
    id: string,
    roomId: string,
    userId: string,
    title: string,
  ): Promise<void> {
    const roomList: Room[] = await this.cache.get('roomList');
    console.log(id, userId, roomId, title);
    roomList.push({ id, userId, roomId, title, onAir: true });
    await this.cache.set('roomList', roomList);
  }

  public async removeRoom(userId: string): Promise<void> {
    const roomList: Room[] = await this.cache.get('roomList');

    if (roomList) {
      const newRoomList = roomList.filter((room) => {
        return room.userId !== userId;
      });
      newRoomList.map((room) => {
        if (room.onAir === userId) {
          room.onAir = true;
          return { room };
        }
      });
      await this.cache.set('roomList', newRoomList);
    }
  }

  public async roomList() {
    const roomList: Room[] = await this.cache.get('roomList');
    console.log(roomList, 'dfdf'); //이게 왜 null임?

    if (roomList !== [null]) {
      const sendList = roomList.map((room) => {
        return { id: room.id, onAir: room.onAir, title: room.title };
      });
      return sendList;
    }
    return null;
  }

  public async roomStateChage(roomId: string, userId: string) {
    const roomList: Room[] = await this.cache.get('roomList');
    console.log({ roomList });
    const newRoomList = roomList.map((room) => {
      if (room.id === roomId) {
        room.onAir = userId;
        return room;
      }
    });
    await this.cache.set('roomList', newRoomList);
  }
}
