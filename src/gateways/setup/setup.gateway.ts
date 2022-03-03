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

  async handleConnection(@ConnectedSocket() client: Socket) {
    console.log(client.data.tmep, '@232');
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.sockets = this.sockets.filter((socket) => {
      return socket.id !== client.id;
    });
    console.log(this.sockets);
  }

  @SubscribeMessage('setInit')
  handleMessage(client: Socket, payload: IPayload) {
    // const user = await this.usersService.findOne(payload.userId);

    for (let socket of this.sockets) {
      console.log(socket.data.userId);
      if (
        socket.data.userId === payload.userId
        //  &&
        // socket.data.userAgent === checkAgent
      ) {
        client.disconnect();
        return;
      }
    }

    client.data.userId = payload.userId;
    // client.data.userAgent = checkAgent;

    this.sockets.push(client);
    client.join(payload.userId.toString());

    client.to(payload.userId.toString()).emit('sendOffer');
  }
  @SubscribeMessage('getOffer')
  sendMessage(client: Socket, payload: OfferPayload) {
    client.to(payload.userId.toString()).emit('getOffer', payload.data);
  }

  @SubscribeMessage('peerConnectComplete')
  sendRoomId(client: Socket, payload: IPayload) {
    this.sockets.map((socket) => {
      if (payload.userId === socket.data.userId) {
        if (socket.data.userAgent === 'VR') {
          const id = nanoid(10);
          return id;
        } else {
          socket.disconnect();
        }
      }
    });
  }
}
