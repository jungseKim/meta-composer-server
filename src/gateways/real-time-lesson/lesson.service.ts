/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { LessonRoom } from 'src/entities/lessonRoom.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(LessonRoom)
    private lessonRepository: Repository<LessonRoom>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async init(
    client: Socket,
    roomId: string,
  ): Promise<boolean | LessonRoom[]> {
    const lesson = await this.lessonRepository.findOneOrFail({
      roomId: roomId,
    });
    if (!lesson || lesson.userId !== client.data.userId) {
      client.disconnect();
      return false;
    } else {
      client.leave(client.id);
      client.join(lesson.roomId);
      client.data.roomId = roomId;
      return await this.lessonRepository.find();
    }
  }

  public async roomJoin(client: Socket, roomId: string) {
    const currentRoom = await this.lessonRepository.findOne(client.data.roomId);
    currentRoom.onAir = false;
    const nextRoom = await this.lessonRepository.findOne(client.data.roomId);
    nextRoom.onAir = false;
  }

  public async removeRoom(client: Socket) {
    await this.lessonRepository.findOne({});
    client.data.userId;
  }
}
