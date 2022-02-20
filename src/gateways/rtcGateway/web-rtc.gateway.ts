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
import { find } from 'rxjs';

import { Server, Socket } from 'socket.io';
import Clients from 'src/types/Clients';
import IPayload from 'src/types/InitPayload';
import InitPayload from 'src/types/InitPayload';
import OfferPayload from 'src/types/OfferPayload';
@WebSocketGateway(4400, {
  namespace: 'webRtc',
  cors: {
    origin: 'http://localhost:3000',
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
    console.log('emf');
    client.data.roomid = payload.userId;
    client.join(payload.userId);
    client.to(payload.userId).emit('sendOffer');
  }

  @SubscribeMessage('getOffer')
  sendMessage(client: Socket, payload: OfferPayload) {
    client.to(payload.userId).emit('getOffer', payload.data);

    // console.log(this.clients[payload.userId], '겟오퍼');
    //index 기반 interface 으로해서 index=client.id 로하고 value를 client와 user.id 로 하자
  }

  //https://socket.io/docs/v3/rooms/
  //https://taehyeki.tistory.com/73?category=928019
}
