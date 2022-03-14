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
    const room: ChatRoom = client.data.currentRoom;
    if (room.id === payload.roomId) {
      await this.chatService.saveMessage(
        client.data.user,
        room,
        payload.message,
      );
      client.to(payload.roomId.toString()).emit(payload.message);
    }
  }

  @SubscribeMessage('chatJoin')
  async chatJoin(client: Socket, roomId: string) {
    const room: ChatRoom = client.data.currentRoom;
    client.data.currentRoom = room; //다른 방이면 메세지 막음
  }
}
