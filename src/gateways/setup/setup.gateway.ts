import { JwtRefreshGuard } from './../../auth/jwt-refresh.guard';
import { SetupService } from './setup.service';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { customAlphabet, nanoid } from 'nanoid';
import EnterPayload from 'src/types/EnterPayload';
import { JwtGuard } from 'src/auth/jwt.guard';
import OfferPayload from 'src/types/OfferPayload';
import IPayload from 'src/types/InitPayload';
import { JwtSocketGouard } from '../jwt-socket.guard';
import { SocketUserData } from 'src/common/interceptors/socketUserData.interceptor';
import { stringify } from 'querystring';
import RtcData from 'src/types/OfferPayload';

@WebSocketGateway({
  namespace: 'selfSetup',
  cors: {
    origin:
      process.env.NODE_ENV === 'dev'
        ? 'http://localhost:3000'
        : process.env.CORS_ORIGIN,
  },
})
@UseInterceptors(SocketUserData)
@UseGuards(JwtSocketGouard)
export class SetupGateway implements OnGatewayConnection, OnGatewayDisconnect {
  sockets: Socket[];
  constructor(private setupService: SetupService) {
    this.sockets = [];
  }
  @WebSocketServer()
  sever: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {}

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.sockets = this.sockets.filter((socket) => {
      return socket.id !== client.id;
    });
  }

  @SubscribeMessage('setInit')
  handleMessage(client: Socket) {
    const agent = this.setupService.agentSortation(client);
    if (!agent) {
      client.disconnect();
      return;
    }
    client.data.userAgent = agent;
    for (let socket of this.sockets) {
      if (
        socket.data.userId === client.data.userId &&
        socket.data.userAgent === client.data.userAgent
      ) {
        client.disconnect();
        return;
      }
    }

    this.sockets.push(client);

    const id: number = client.data.userId;
    client.join(id.toString());
    client.to(id.toString()).emit('sendOffer');
    console.log(this.sever.sockets);
  }

  @SubscribeMessage('getOffer')
  sendMessage(client: Socket, data: RtcData) {
    const id: number = client.data.userId;
    client.to(id.toString()).emit('getOffer', data);
  }

  @SubscribeMessage('peerConnectComplete')
  sendRoomId(client: Socket) {
    this.sockets.map((socket) => {
      if (client.data.userId === socket.data.userId) {
        if (socket.data.userAgent === 'vr') {
          const id = nanoid(10);
          return id;
        } else {
          socket.disconnect();
        }
      }
    });
  }
  @SubscribeMessage('test')
  test(client: Socket) {
    console.log(client.data.userId);
  }
}
