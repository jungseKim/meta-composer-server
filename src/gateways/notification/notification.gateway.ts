import { UseFilters } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  BaseWsExceptionFilter,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { NotificationSocekt } from "../custom-sockets/my-socket";
import { JwtSocketGouard } from "../jwt-socket.guard";
import { WSAuthMiddleware } from "../middleware/auth.middleware";
import { NotificationService } from "./notification.service";

// @UseFilters(new BaseWsExceptionFilter())
@WebSocketGateway({
  namespace: "notification",
  cors: {
    origin:
      process.env.NODE_ENV === "dev"
        ? "http://localhost:3000"
        : process.env.CORS_ORIGIN,
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private notificationService: NotificationService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async handleConnection(@ConnectedSocket() client: NotificationSocekt) {
    // console.log(client.user.username);
    await this.notificationService.auth(client);
  }
  afterInit(server: Server) {
    const middle = WSAuthMiddleware(this.userRepository);
    server.use(middle);
    console.log(`WS ${NotificationGateway.name} init`);
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
