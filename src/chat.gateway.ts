import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'ws';

@WebSocketGateway(4444)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  users: Record<string, any>;
  @WebSocketServer()
  server: Server;

  constructor() {
    this.users = {};
  }

  async handleConnection(@ConnectedSocket() client: any) {
    client['id'] = String(Number(new Date()));
    client['nickname'] = String(Number(new Date()));
    this.users[client['id']] = client;
  }

  handleDisconnect(@ConnectedSocket() client: any) {
    delete this.users[client['id']];
  }

  @SubscribeMessage('chat')
  handleMessage(client: any, data: string) {
    for (const [key, value] of Object.entries(this.users)) {
      if (value.nickname != client['nickname']) {
        value.send(
          JSON.stringify({
            event: 'events',
            msg: { nickname: client['nickname'], message: data },
          }),
        );
      }
    }
  }
}
