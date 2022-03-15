import { Message } from 'src/entities/message.entity';
import { ChatService } from './chat.service';
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
import { ChatRoom } from 'src/entities/chatRoom.entity';

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

  constructor(private chatService: ChatService) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    return this.chatService.auth(client);
  }

  handleDisconnect(@ConnectedSocket() client: any) {}

  @SubscribeMessage('sendMessage')
  async sendMessage(
    client: Socket,
    payload: { roomId: number; message: string },
  ) {
    console.log(payload);
    const roomId: number = client.data.currentRoomId;
    const userId: number = client.data.userId;
    if (roomId === payload.roomId) {
      const message = await this.chatService.saveMessage(
        userId,
        payload.roomId,
        payload.message,
      );
      client.to(payload.roomId.toString()).emit('getMessage', message);
    }
  }

  @SubscribeMessage('chatJoin')
  async chatRoomJoin(client: Socket, roomId: number) {
    this.chatService.chatRoomJoin(client, roomId);
    //다른 방이면 메세지 막음
  }
}
