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
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
@WebSocketGateway({
  namespace: 'notification',
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private notificationService: NotificationService) {}

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string) {
    this.server.emit('events', data);
  }
  async handleConnection(@ConnectedSocket() client: Socket) {
    this.notificationService.auth(client);
  }

  handleDisconnect(@ConnectedSocket() client: any) {}
}
