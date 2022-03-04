import { User } from './../../entities/user.entity';
import { LessonRoom } from './../../entities/lessonRoom.entity';
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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
  constructor(
    private setupService: SetupService,
    @InjectRepository(LessonRoom)
    private lessonRepository: Repository<LessonRoom>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    this.sockets = [];
  }
  @WebSocketServer()
  sever: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    const authToken = client.handshake.auth;
    console.log(authToken);
    console.log('init');
  }

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
    // console.log(this.sever.);
  }

  @SubscribeMessage('getOffer')
  sendMessage(client: Socket, data: RtcData) {
    const id: number = client.data.userId;
    client.to(id.toString()).emit('getOffer', data);
  }

  @SubscribeMessage('peerConnectComplete')
  sendRoomId(client: Socket) {
    this.sockets.map(async (socket) => {
      if (client.data.userId === socket.data.userId) {
        if (socket.data.userAgent === 'vr') {
          const roomid = nanoid(10);
          // const user = await this.userRepository.findOne(client.data.userId);
          await this.lessonRepository
            .create({
              roomid,
              userId: socket.data.userId,
            })
            .save();
          return roomid;
        } else {
          socket.disconnect();
        }
      }
    });
  }
}
