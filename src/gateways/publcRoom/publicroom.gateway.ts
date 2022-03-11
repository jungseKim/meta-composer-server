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
import { nanoid } from 'nanoid';
import { Server, Socket } from 'socket.io';
import { PublicRoomnService } from './publicroomn.service';
import RtcData from 'src/types/OfferPayload';

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
    return this.publicRoomnService.auth(client);
  }

  @SubscribeMessage('roomList')
  async roomList() {
    return await this.publicRoomnService.roomList();
  }

  @SubscribeMessage('create')
  async makeRoom(client: Socket, title: string) {
    const exist = await this.publicRoomnService.existRoom(client.data.userId);
    if (exist) {
      return '이미 참가하고 있는 방이 있습니다';
    }
    const roomId = nanoid(10);
    const id = nanoid(5);

    const room = await this.publicRoomnService.create(
      id,
      client,
      roomId,
      title,
    );
    await this.roomListchange();
    return room;
  }

  @SubscribeMessage('leaveRoom')
  async removeRoom(client: Socket, roomId: string | undefined) {
    await this.publicRoomnService.leaveRoom(client, roomId);
    await this.roomListchange();
  }

  @SubscribeMessage('join')
  async joinRoom(client: Socket, roomId: string) {
    const exist = await this.publicRoomnService.existRoom(client.data.userId);
    if (exist) {
      return '이미 참가하고 있는 방이 있습니다';
    }
    const RoomOrFalse = await this.publicRoomnService.joinRoom(client, roomId);
    if (RoomOrFalse) {
      this.roomListchange();
      return RoomOrFalse;
    } else {
      return 'aleady exsit room';
    }
  }

  @SubscribeMessage('enterRoom')
  entrance(client: Socket, roomId: string) {
    client.join(roomId);
    client.to(roomId).emit('sendOffer');
  }

  @SubscribeMessage('getOffer')
  sendMessage(client: Socket, roomId: string, data: RtcData) {
    client.to(roomId).emit('getOffer', data);
  }

  async handleDisconnect(client: Socket) {
    await this.publicRoomnService.leaveUser(client);
    await this.roomListchange();
  }

  public async roomListchange() {
    const roomList = await this.publicRoomnService.roomList();
    this.server.emit('listChange', roomList);
  }
}
