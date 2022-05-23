import { PublicRoom } from "../types/public-room";
/*
https://docs.nestjs.com/providers#services
*/

import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { timingSafeEqual } from "crypto";
import { LessonAttendanceDto } from "src/types/lesson-class";
import { User } from "src/entities/user.entity";
import { Lesson } from "src/entities/lesson.entity";

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {
    this.cache.set("roomList", []);
  }

  public async addUser(key: string, value: number): Promise<void> {
    await this.cache.set(key, value, {
      ttl: 60 * 60,
    });
    console.log("저장");
  }

  public async getUser(key: string): Promise<number> {
    const redisValue: number = await this.cache.get(key);
    console.log("꺼냄");
    return redisValue;
  }

  public async removeUser(key: string): Promise<void> {
    await this.cache.del(key);
    console.log("삭제");
  }

  public async privateRooms(): Promise<PublicRoom[]> {
    return this.cache.get("roomList");
  }

  public async addRoom(
    id: string,
    roomKey: string,
    userId: string,
    title: string,
  ): Promise<PublicRoom | boolean> {
    const roomList: PublicRoom[] = await this.cache.get("roomList");
    if (id && userId && roomKey && title) {
      const room: PublicRoom = { id, userId, roomKey, title, onAir: true };
      roomList.push(room);
      await this.cache.set("roomList", roomList);
      return room;
    }
    return false;
  }

  public async removeRoom(userId: string): Promise<void> {
    const roomList: PublicRoom[] = await this.cache.get("roomList");

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
      await this.cache.set("roomList", newRoomList);
    }
  }

  public async roomList() {
    const roomList: PublicRoom[] = await this.cache.get("roomList");
    console.log(roomList, "dfdf"); //이게 왜 null임?

    if (roomList !== [null]) {
      const sendList = roomList.map((room) => {
        return { id: room.id, onAir: room.onAir, title: room.title };
      });
      return sendList;
    }
    return null;
  }

  public async roomStateChage(roomId: string, userId: string) {
    const roomList: PublicRoom[] = await this.cache.get("roomList");
    console.log({ roomList });
    const newRoomList = roomList.map((room) => {
      if (room.id === roomId) {
        room.onAir = userId;
        return room;
      }
    });
    await this.cache.set("roomList", newRoomList);
  }

  public async addLessonRoom(
    key: number,
    value: LessonAttendanceDto,
  ): Promise<void> {
    await this.cache.set(`lesson-${key}`, value, {
      ttl: 20 * 60,
    });
  }
  public async getLessonRoom(key: number): Promise<LessonAttendanceDto> {
    return await this.cache.get(`lesson-${key}`);
  }
  public async removeLessonRoom(key: number) {
    await this.cache.del(`lesson-${key}`);
  }

  public async add_user_recommendation_data(
    userId: string,
    recommendation_data: Lesson[],
    result_recommendation: string,
  ) {
    await this.cache.set(userId, [
      { "recommended genre: ": result_recommendation },
      recommendation_data,
    ]);
  }

  public async get_user_recommendation_data(key: string) {
    return await this.cache.get(key);
  }

  public async delete_user_recommendation_data(key: string) {
    return await this.cache.del(key);
  }
}
