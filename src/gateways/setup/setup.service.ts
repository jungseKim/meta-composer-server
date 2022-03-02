import { Socket } from 'socket.io';
import { retry } from 'rxjs';
import { customAlphabet } from 'nanoid';
import * as jwt from 'jsonwebtoken';
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SetupService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async whoami(client: Socket) {
    const authToken = client.handshake.auth.token.split(' ')[1];
    const jwtPayload: TokenPayload = <TokenPayload>(
      jwt.verify(authToken, 'jungse')
    );
    const user = await this.userRepository.findOne(jwtPayload['userId']);
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
  public agentSortation(agent: string) {
    if (agent.indexOf('VR') !== -1) return 'VR';
    if (agent.indexOf('OculusBrowser') !== -1) return 'VR';
    return 'PC';
  }
}
