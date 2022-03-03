import { Socket } from 'socket.io';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { targetModulesByContainer } from '@nestjs/core/router/router-module';
import { TokenPayload } from 'src/auth/token-payload.interface';
import * as jwt from 'jsonwebtoken';
import { UAParser } from 'ua-parser-js';
import { timingSafeEqual } from 'crypto';
@Injectable()
export class SocketUserData implements NestInterceptor {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.userRepository = userRepository;
  }
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const client = context.switchToWs().getClient() as Socket;

    if (!client.data.userId) {
      const authToken = client.handshake.auth.token.split(' ')[1];
      const jwtPayload: TokenPayload = <TokenPayload>(
        jwt.verify(authToken, process.env.JWT_SECRET)
      );

      client.data.userId = await this.userRepository.findOne(
        jwtPayload['userId'],
      );
    }
    if (!client.data.agent) {
      new UAParser(client.handshake.headers['user-agent']).getBrowser();
    }
    // client.disconnect();
    return next.handle();
  }
}
