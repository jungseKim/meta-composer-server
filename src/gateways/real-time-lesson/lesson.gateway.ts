import { Server, Socket } from 'socket.io';
/*
https://docs.nestjs.com/websockets/gateways#gateways
*/

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
import IPayload from 'src/types/InitPayload';
import OfferPayload from 'src/types/OfferPayload';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtSocketGouard } from '../jwt-socket.guard';
import { throws } from 'assert';
import { json } from 'stream/consumers';
import RtcData from 'src/types/OfferPayload';
import { LessonService } from './lesson.service';
import { SocketUserData } from 'src/common/interceptors/socketUserData.interceptor';

@WebSocketGateway({
  namespace: 'lesson',
  cors: {
    origin:
      process.env.NODE_ENV === 'dev'
        ? 'http://localhost:3000'
        : process.env.CORS_ORIGIN,
  },
})
@UseGuards(JwtSocketGouard)
@UseInterceptors(SocketUserData)
export class LessonGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private lessonService: LessonService) {}
  handleConnection(@ConnectedSocket() client: Socket) {}

  handleDisconnect(@ConnectedSocket() client: Socket) {
    // this.removeRoom(client);
  }

  @SubscribeMessage('setInit')
  setInit(client: Socket, roomId: string) {
    return this.lessonService.init(client, roomId);
  }

  @SubscribeMessage('roomJoin')
  roomJoin(client: Socket, roomId: string) {
    client.leave(client.data.roomId);
    // this.removeRoom(client);

    client.data.roomId = roomId;
    client.join(roomId);
    client.to(roomId).emit('sendOffer');
  }

  @SubscribeMessage('getOffer')
  sendMessage(client: Socket, data: RtcData) {
    client.to(client.data.roomId).emit('getOffer', data);
  }

  // public removeRoom(client: Socket) {
  //   this.rooms = this.rooms.filter((id) => {
  //     return id !== client.data.roomId;
  //   });
  // }
}
