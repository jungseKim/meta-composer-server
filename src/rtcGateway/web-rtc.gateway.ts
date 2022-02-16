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
  clients: Clients;
  clientsNumber: string[];
  @WebSocketServer()
  server: Server;

  constructor() {
    this.clients = {};
    this.clientsNumber = [];
  }

  async handleConnection(@ConnectedSocket() client: Socket) {}

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const vm = this;
    this.clientsNumber.forEach((num) => {
      vm.clients[num] = vm.clients[num].filter((c) => {
        return c.id !== client.id;
      });
      if (vm.clients[num].length < 1) {
        delete vm.clients[num];
        delete vm.clientsNumber[vm.clientsNumber.findIndex((a) => a === num)];
        // array delete는 배열 요소를 삭제 index 안줄어듬
        // object 는 삭제 깔끔하게 해줌
      }
      console.log(vm.clients, this.clientsNumber.length);
    });
  }

  @SubscribeMessage('setInit')
  setInit(client: Socket, payload: IPayload) {
    if (this.clients[payload.userId]) {
      client.emit('sendOffer');
    } else {
      this.clients[payload.userId] = [];
      this.clientsNumber.push(payload.userId);
    }
    this.clients[payload.userId].push(client);

    console.log(this.clients[payload.userId].length, this.clientsNumber);
  }

  // @SubscribeMessage('selfDisconnect')
  // selfDisconnect(client: Socket, payload: IPayload) {
  //   console.log('heellw');
  // this.clients[payload.userId] = this.clients[payload.userId].filter((c) => {
  //   return c.id !== client.id;
  // });
  // console.log(this.clients[payload.userId].length, 'disconnect');
  // }

  @SubscribeMessage('getOffer')
  sendMessage(client: Socket, payload: OfferPayload) {
    console.log('getOffer', payload);
    this.clients[payload.userId].forEach((socket) => {
      if (socket.id !== client.id) {
        console.log(socket.id, client.id);
        socket.emit('getOffer', payload.data);
      }
    });
    // this.clients[payload.userId].sockets.forEach(socket => {
    //   socket.
    // })
    // console.log(this.clients[payload.userId], '겟오퍼');
    //index 기반 interface 으로해서 index=client.id 로하고 value를 client와 user.id 로 하자
  }
}
