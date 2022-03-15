/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { TokenPayload } from 'src/auth/token-payload.interface';
import { ChatRoom } from 'src/entities/chatRoom.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async auth(client: Socket): Promise<ChatRoom[]> {
    const authToken = client.handshake.auth.token.split(' ')[1];

    if (!authToken) {
      client.disconnect();
      return;
    }

    const jwtPayload: TokenPayload = <TokenPayload>(
      jwt.verify(authToken, process.env.JWT_SECRET)
    );

    const user = await this.userRepository.findOne(jwtPayload['userId']);
    if (!user) {
      client.disconnect();
      return;
    }

    client.data.userId = user.id;
  }
}
