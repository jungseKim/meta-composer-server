import { Server, Socket } from 'socket.io';
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
} from '@nestjs/websockets';
import IPayload from 'src/types/InitPayload';
import OfferPayload from 'src/types/OfferPayload';

@WebSocketGateway({
  namespace: 'lesson',
  cors: {
    origin:
      process.env.NODE_ENV === 'dev'
        ? 'http://localhost:3000'
        : process.env.CORS_ORIGIN,
  },
})
export class LessonGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('setInit')
  setInit(client: Socket, roomId: string) {
    // console.log(client.handshake.headers['user-agent']);
    // console.log(new UAParser(client.handshake.headers['user-agent']));
    client.join(roomId);
    client.to(roomId).emit('sendOffer');
  }

  @SubscribeMessage('getOffer')
  sendMessage(client: Socket, payload: OfferPayload) {
    client.to(payload.roomId).emit('getOffer', payload.data);

    // console.log(this.clients[payload.userId], '겟오퍼');
    //index 기반 interface 으로해서 index=client.id 로하고 value를 client와 user.id 로 하자
  }
}
