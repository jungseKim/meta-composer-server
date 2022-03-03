import { Socket } from 'socket.io';
import { PassportStrategy } from '@nestjs/passport';
import { OnGatewayDisconnect } from '@nestjs/websockets';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
/*
https://docs.nestjs.com/guards#guards
*/

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenPayload } from 'src/auth/token-payload.interface';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { VerifiedCallback } from 'passport-jwt';
@Injectable()
export class JwtSocketGouard implements CanActivate {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>, // private userRepository: Repository<User>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient() as Socket;
    // console.log(client.handshake.auth.token);
    const authToken = client.handshake.auth.token.split(' ')[1];
    const jwtPayload: TokenPayload = <TokenPayload>(
      jwt.verify(authToken, process.env.JWT_SECRET)
    );

    const user = await this.userRepository.findOne(jwtPayload['userId']);

    if (user) {
      client.data.temp = '그냥 넣어봄';
      return true;
    }
    // client.disconnect(); 여기도 됨
    return false;
  }
}
