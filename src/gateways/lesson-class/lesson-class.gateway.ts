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
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import RtcData from "src/types/OfferPayload";
import { LessonSocket } from "../custom-sockets/chat-socket";
import { LessonClassService } from "./lesson-class.service";

@WebSocketGateway({
  namespace: "lesson",
  cors: {
    origin:
      process.env.NODE_ENV === "dev"
        ? "http://localhost:3000"
        : process.env.CORS_ORIGIN,
  },
})
export class LessonClassGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private lessonClassService: LessonClassService) {}

  @SubscribeMessage("setInit")
  firstConnection(client: LessonSocket, roomId: number) {
    return this.lessonClassService.setInit(client, roomId);
  }

  @SubscribeMessage("retry")
  retryConnection(client: LessonSocket, roomId: number) {
    return this.lessonClassService.LessonConnection(client, roomId);
  }

  @SubscribeMessage("getOffer")
  sendMessage(client: Socket, data: RtcData) {
    client.rooms.forEach((room) => {
      client.to(room).emit("getOffer", data);
    });
  }

  handleConnection(client: LessonSocket) {}

  handleDisconnect(client: LessonSocket) {
    console.log("User disconnected");
  }
}
