/*
https://docs.nestjs.com/websockets/gateways#gateways
*/

import { UseGuards, UseInterceptors } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketUserData } from 'src/common/interceptors/socketUserData.interceptor';
import { JwtSocketGouard } from '../jwt-socket.guard';
import { PublicRoomnService } from './publicroomn.service';

@WebSocketGateway({
  namespace: 'public',
  cors: {
    origin:
      process.env.NODE_ENV === 'dev'
        ? 'http://localhost:3000'
        : process.env.CORS_ORIGIN,
  },
})
export class PublicRoomGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private publicRoomnService: PublicRoomnService) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    this.publicRoomnService.auth(client);
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected');
  }

  @SubscribeMessage('makeRoom')
  makeRoom(client: Socket) {}
}
