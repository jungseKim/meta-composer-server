import { Repository } from 'typeorm';
import { LessonRoom } from './../../entities/lessonRoom.entity';
import { type } from 'os';
import { Socket } from 'socket.io';
import { retry } from 'rxjs';
import { customAlphabet, nanoid } from 'nanoid';
import * as jwt from 'jsonwebtoken';
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { User } from 'src/entities/user.entity';

@Injectable()
export class SetupService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public agentSortation(sockets: Socket[], client: Socket): boolean {
    console.log(sockets.length);
    for (let socket of sockets) {
      if (
        socket.data.userId === client.data.userId &&
        socket.data.userAgent === client.data.userAgent
      ) {
        client.disconnect();
        return false;
      }
    }
    sockets.push(client);
    return true;
  }

  public async connected(sockets: Socket[], client: Socket) {
    const authToken = client.handshake.auth.token.split(' ')[1];

    const agent = new UAParser(client.handshake.headers['user-agent']);

    const type = agent.getDevice().type;

    const jwtPayload: TokenPayload = <TokenPayload>(
      jwt.verify(authToken, process.env.JWT_SECRET)
    );

    const user = await this.userRepository.findOne(jwtPayload['userId']);
    if (authToken === '' || !authToken || type == 'mobile' || !user) {
      client.disconnect();
      return false;
    }
    client.data.userId = user.id.toString();

    client.data.userAgent =
      agent.getBrowser().name === 'Oculus Browser' ? 'vr' : 'pc';

    return this.agentSortation(sockets, client);
  }

  // public async createRoom(client:Socket){
  //   const id = nanoid(10);
  //   this.lessonRepository.create({
  //     roomid:id
  //     user
  //   })
  // }
}
