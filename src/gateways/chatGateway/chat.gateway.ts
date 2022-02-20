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

@WebSocketGateway(4400, {
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

  handleDisconnect(@ConnectedSocket() client: any) {
    delete this.client[client['id']];
  }

  @SubscribeMessage('setInit')
  setInit(client: Socket, payload: any) {
    if (client.data.isInit) {
      return;
    }
    client.data.nickname = payload.nickname
      ? payload.nickname
      : '낯선사람' + client.id;
    client.data.isInit = true;
    return {
      nickname: client.data.nickname,
    };
  }
  @SubscribeMessage('test')
  test(client: Socket, payload: any) {
    if (client.data.isInit) {
      console.log(client.data.isInit, client.data.nickname);
    }
  }

  @SubscribeMessage('sendMessage')
  sendMessage(client: Socket, message: string): void {
    this.server.emit('getMessage', message);
  }
}
