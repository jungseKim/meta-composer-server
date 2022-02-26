import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  client: Record<string, Socket>;
  @WebSocketServer()
  server: Server;

  constructor() {
    this.client = {};
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log('connected', client.id);
    this.client[client.id] = client;
    return 'aart';
  }

  handleDisconnect(@ConnectedSocket() client: any) {}

  @SubscribeMessage('setInit')
  async setInit(client: Socket, payload: any) {}

  @SubscribeMessage('sendMessage')
  sendMessage(client: Socket, message: string): void {
    this.server.emit('getMessage', message);
  }
}
