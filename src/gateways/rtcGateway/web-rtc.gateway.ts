import { Req } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { type } from 'os';
import { find } from 'rxjs';

import { Server, Socket } from 'socket.io';
import Clients from 'src/types/Clients';
import IPayload from 'src/types/InitPayload';
import InitPayload from 'src/types/InitPayload';
import OfferPayload from 'src/types/OfferPayload';
import { UAParser } from 'ua-parser-js';
@WebSocketGateway({
  namespace: 'webRtc',
  cors: {
    origin:
      process.env.NODE_ENV === 'dev'
        ? 'http://localhost:3000'
        : process.env.CORS_ORING,
  },
})
export class WebRtcGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // client: Record<string, Client>;

  @WebSocketServer()
  server: Server;

  constructor() {}

  async handleConnection(@ConnectedSocket() client: Socket) {}

  handleDisconnect(@ConnectedSocket() client: Socket) {}

  @SubscribeMessage('setInit')
  setInit(client: Socket, payload: IPayload) {
    // console.log(client.handshake.headers['user-agent']);
    // console.log(new UAParser(client.handshake.headers['user-agent']));

    client.join(payload.userId.toString());
    client.to(payload.userId.toString()).emit('sendOffer');
  }

  @SubscribeMessage('getOffer')
  sendMessage(client: Socket, payload: OfferPayload) {
    console.log(payload.data);
    client.to(payload.userId.toString()).emit('getOffer', payload.data);

    // console.log(this.clients[payload.userId], '겟오퍼');
    //index 기반 interface 으로해서 index=client.id 로하고 value를 client와 user.id 로 하자
  }

  //https://socket.io/docs/v3/rooms/
  //https://taehyeki.tistory.com/73?category=928019
}
