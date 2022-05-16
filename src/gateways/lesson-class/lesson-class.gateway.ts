/*
https://docs.nestjs.com/websockets/gateways#gateways
*/

import { InjectRepository } from "@nestjs/typeorm";
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
import { User } from "src/entities/user.entity";
import RtcData from "src/types/OfferPayload";
import { Repository } from "typeorm";
import { LessonSocket } from "../custom-sockets/my-socket";
import { WSAuthMiddleware } from "../middleware/auth.middleware";
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
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private lessonClassService: LessonClassService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  afterInit(server: Server) {
    const middle = WSAuthMiddleware(this.userRepository);
    server.use(middle);
  }

  // @SubscribeMessage("setInit")
  // firstConnection(client: LessonSocket, lessonId: number) {
  //   return this.lessonClassService.setInit(client, lessonId);
  // }

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

  handleConnection(client: LessonSocket) {
    // return this.lessonClassService.TestLessonConnection(client)
  }

  handleDisconnect(client: LessonSocket) {
    console.log("User disconnected");
  }
}
