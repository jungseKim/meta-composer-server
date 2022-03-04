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
import { UseGuards } from '@nestjs/common';
import { JwtSocketGouard } from '../jwt-socket.guard';
import { throws } from 'assert';
import { json } from 'stream/consumers';
import RtcData from 'src/types/OfferPayload';

@WebSocketGateway({
  namespace: 'lesson',
  cors: {
    origin:
      process.env.NODE_ENV === 'dev'
        ? 'http://localhost:3000'
        : process.env.CORS_ORIGIN,
  },
})
// @UseGuards(JwtSocketGouard)
export class LessonGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  rooms: string[];
  constructor() {
    this.rooms = [];
  }
  handleConnection(@ConnectedSocket() client: Socket) {}

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.removeRoom(client);
  }

  @SubscribeMessage('setInit')
  setInit(client: Socket, roomId: string) {
    this.rooms.push(roomId);
    client.leave(client.id);
    client.join(roomId);
    client.data.roomId = roomId;
    const OtherRooms = this.rooms.filter((id) => {
      return id !== roomId;
    });

    return OtherRooms;
  }

  @SubscribeMessage('roomJoin')
  roomJoin(client: Socket, roomId: string) {
    client.leave(client.data.roomId);
    this.removeRoom(client);

    client.data.roomId = roomId;
    client.join(roomId);
    client.to(roomId).emit('sendOffer');
  }

  @SubscribeMessage('getOffer')
  sendMessage(client: Socket, data: RtcData) {
    client.to(client.data.roomId).emit('getOffer', data);
  }

  public removeRoom(client: Socket) {
    this.rooms = this.rooms.filter((id) => {
      return id !== client.data.roomId;
    });
  }
}
