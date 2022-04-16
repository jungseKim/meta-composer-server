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
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatSocekt, NotificationSocekt } from "../custom-sockets/my-socket";
import { NotificationService } from "./notification.service";
@WebSocketGateway({
  namespace: "notification",
  cors: {
    origin: "http://localhost:3000",
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private notificationService: NotificationService) {}

  async handleConnection(@ConnectedSocket() client: NotificationSocekt) {
    await this.notificationService.auth(client);
  }

  handleDisconnect(@ConnectedSocket() client: NotificationSocekt) {
    this.notificationService.disconnection(client); //여기서 해당방 에 이벤트 보내기
  }
  @SubscribeMessage("chatJoin-emit")
  async chatRoomJoin(client: NotificationSocekt, payload: { roomId: number }) {
    await this.notificationService.chatRoomJoin(client, payload.roomId);
  }
  @SubscribeMessage("chatLeave-emit")
  async chatRoomLeavea(client: NotificationSocekt) {
    client.to(`chat-room-${client.chatRoomId}`).emit("chatLeave-event");
  }
  @SubscribeMessage("chat-current-user-emit")
  async chatCurrentUser(client: NotificationSocekt) {
    client.to(`chat-room-${client.chatRoomId}`).emit("chatJoin-event");
  }
}
