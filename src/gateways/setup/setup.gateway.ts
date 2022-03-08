import { User } from './../../entities/user.entity';
import { LessonRoom } from './../../entities/lessonRoom.entity';
import { JwtRefreshGuard } from './../../auth/jwt-refresh.guard';
import { SetupService } from './setup.service';
import {
  UseGuards,
  UseInterceptors,
  CanActivate,
  UnauthorizedException,
  Injectable,
} from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { customAlphabet, nanoid } from 'nanoid';
import EnterPayload from 'src/types/EnterPayload';
import { JwtGuard } from 'src/auth/jwt.guard';
import OfferPayload from 'src/types/OfferPayload';
import IPayload from 'src/types/InitPayload';
import { JwtSocketGouard } from '../jwt-socket.guard';
import { SocketUserData } from 'src/common/interceptors/socketUserData.interceptor';
import { stringify } from 'querystring';
import RtcData from 'src/types/OfferPayload';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisCacheService } from 'src/cache/rediscache.service';

@WebSocketGateway({
  namespace: 'selfSetup',
  cors: {
    origin:
      process.env.NODE_ENV === 'dev'
        ? 'http://localhost:3000'
        : process.env.CORS_ORIGIN,
  },
})
export class SetupGateway implements OnGatewayConnection, OnGatewayDisconnect {
  sockets: Socket[];
  constructor(
    private setupService: SetupService,
    private redisCacheService: RedisCacheService,
  ) {
    this.sockets = [];
  }
  @WebSocketServer()
  sever: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    const auth = await this.setupService.connected(this.sockets, client);
    if (!auth) return;

    const id = client.data.userId;

    client.join(id);
    client.to(id).emit('sendOffer');
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.sockets = this.sockets.filter((socket) => {
      return socket.id !== client.id;
    });
  }

  @SubscribeMessage('getOffer')
  sendMessage(client: Socket, data: RtcData) {
    const id: number = client.data.userId;
    client.to(id.toString()).emit('getOffer', data);
  }

  @SubscribeMessage('peerConnectComplete')
  sendRoomId(client: Socket) {
    this.sockets.map(async (socket) => {
      if (client.data.userId === socket.data.userId) {
        if (socket.data.userAgent === 'vr') {
          this.redisCacheService.set(
            client.handshake.auth.token.split(' ')[1],
            socket.data.userId,
          );
          return client.id;
        } else {
          socket.disconnect();
        }
      }
    });
  }
}
