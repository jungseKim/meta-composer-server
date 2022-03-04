import { Socket } from 'socket.io';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { TokenPayload } from 'src/auth/token-payload.interface';
import * as jwt from 'jsonwebtoken';
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
      const data = await this.userRepository.findOne(jwtPayload['userId']);

      client.data.userId = data.id;
    }

    return next.handle();
  }
}
