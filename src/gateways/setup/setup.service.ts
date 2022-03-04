import { Repository } from 'typeorm';
import { LessonRoom } from './../../entities/lessonRoom.entity';
import { type } from 'os';
import { Socket } from 'socket.io';
import { retry } from 'rxjs';
import { customAlphabet, nanoid } from 'nanoid';
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SetupService {
  constructor(
    @InjectRepository(LessonRoom)
    private lessonRepository: Repository<LessonRoom>,
  ) {}
  public agentSortation(client: Socket): string | boolean {
    const agent = new UAParser(client.handshake.headers['user-agent']);
    const type = agent.getDevice().type;
    if (type === 'mobile') {
      return false;
    }
    return agent.getBrowser().name === 'Oculus Browser' ? 'vr' : 'pc';
  }

  // public async createRoom(client:Socket){
  //   const id = nanoid(10);
  //   this.lessonRepository.create({
  //     roomid:id
  //     user
  //   })
  // }
}
