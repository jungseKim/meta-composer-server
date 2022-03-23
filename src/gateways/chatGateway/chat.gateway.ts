import { Message } from "src/entities/message.entity";
import { ChatService } from "./chat.service";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";

import { Server, Socket } from "socket.io";
import { ChatRoom } from "src/entities/chatRoom.entity";
import { ChatSocekt } from "../custom-sockets/my-socket";

@WebSocketGateway({
  namespace: "chat",
  cors: {
    origin: "http://localhost:3000",
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  client: Record<string, Socket>;
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  async handleConnection(@ConnectedSocket() client: ChatSocekt) {
    await this.chatService.auth(client);
  }

  // 채팅 소켓을 따로 빼는 이유
  //1. 커넥션이 끊어지면 바로 알아야 한다
  //2. 서로 연결되었다는 것을 여기서 알려주는게 간단한다.

  @SubscribeMessage("chatJoin-emit")
  async chatRoomJoin(client: ChatSocekt, payload: { roomId: number }) {
    await this.chatService.chatRoomJoin(client, payload.roomId);
  }

  handleDisconnect(@ConnectedSocket() client: ChatSocekt) {
    client.to(client.chatRoomId?.toString()).emit("chatLeave-event");
  }
}
