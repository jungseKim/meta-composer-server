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
import { LessonSocket } from "../custom-sockets/my-socket";
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
  firstConnection(client: LessonSocket, payload: { lessonId: number }) {
    return this.lessonClassService.setInit(client, payload.lessonId);
  }

  @SubscribeMessage("retry")
  retryConnection(client: LessonSocket, lessonId: number) {
    return this.lessonClassService.LessonConnection(client, lessonId);
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
