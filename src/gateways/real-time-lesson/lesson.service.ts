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
    const lesson = await this.lessonRepository.findOneOrFail(roomId);
    if (!lesson) {
      client.disconnect();
      return false;
    } else {
      client.leave(client.id);
      client.join(roomId);
      client.data.roomId = roomId;
      return await this.lessonRepository.find();
    }
  }
  public async removeRoom(client: Socket) {
    await this.lessonRepository.findOne({});
    client.data.userId;
  }
}
