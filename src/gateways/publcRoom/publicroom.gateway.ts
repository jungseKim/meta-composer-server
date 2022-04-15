/*
https://docs.nestjs.com/websockets/gateways#gateways
*/

import {
  Body,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from "@nestjs/common";
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
import { PublicRoomnService } from "./publicroomn.service";
import RtcData from "src/types/OfferPayload";

@WebSocketGateway({
  namespace: "public",
  cors: {
    origin:
      process.env.NODE_ENV === "dev"
        ? "http://localhost:3000"
        : process.env.CORS_ORIGIN,
  },
})
export class PublicRoomGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private publicRoomnService: PublicRoomnService) {}
  @WebSocketServer()
  server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    return await this.publicRoomnService.auth(client);
  }

  @SubscribeMessage("roomList")
  async roomList() {
    return await this.publicRoomnService.roomList();
  }

  @SubscribeMessage("create")
  async makeRoom(client: Socket, payload: { title: string }) {
    return await this.publicRoomnService.create(
      client,
      payload.title,
      this.server,
    );
  }

  @SubscribeMessage("leaveRoom")
  async removeRoom(client: Socket, roomId: string | undefined) {
    await this.publicRoomnService.leaveRoom(client, roomId, this.server);
  }

  //pipe 쓸려면 messageBody 써야되는데 그러면 @@ConnectedSocket() 써줘야
  //인수로 들어옴
  @SubscribeMessage("join")
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody("roomId") roomId: string,
  ) {
    return await this.publicRoomnService.joinRoom(client, roomId, this.server);
  }
  //이게 과연 필요한가..  필요하드라
  @SubscribeMessage("enterRoom")
  entrance(client: Socket, roomKey: string) {
    client.join(roomKey);
    client.to(roomKey).emit("sendOffer");
  }

  @SubscribeMessage("getOffer")
  sendMessage(client: Socket, roomKey: string, data: RtcData) {
    client.to(roomKey).emit("getOffer", data);
  }

  async handleDisconnect(client: Socket) {
    await this.publicRoomnService.leaveUser(client);
    await this.roomListchange();
  }

  public async roomListchange() {
    const roomList = await this.publicRoomnService.roomList();
    this.server.emit("listChange", roomList);
  }
}
