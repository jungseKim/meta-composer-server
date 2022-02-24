import { SetupService } from './setup.service';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { customAlphabet } from 'nanoid';
import EnterPayload from 'src/types/EnterPayload';
import { JwtGuard } from 'src/auth/jwt.guard';
import OfferPayload from 'src/types/OfferPayload';

@WebSocketGateway({
  namespace: 'setup',
  cors: {
    origin:
      process.env.NODE_ENV === 'dev'
        ? 'http://localhost:3000'
        : process.env.CORS_ORING,
  },
})
@UseGuards(JwtGuard)
export class SetupGateway {
  EnterCode: Record<string, string>;

  constructor(private setupService:SetupService){}

  @WebSocketServer()
  sever: Server;
  //오큘러스 고려 없이 만들었을때
  @SubscribeMessage('setInit')
  handleMessage(client: Socket, payload: EnterPayload) {
    if (this.EnterCode[payload.url]) {
      if (this.EnterCode[payload.url] === payload.code) {
        client.join(payload.url);
        client.to(payload.url).emit('sendOffer');
       delete this.EnterCode[payload.url];
      } else {
        client.emit('CodeError');
      }
    } else {
      client.join(payload.url);

      const code=  this.setupService.createEnterCode()
     
      this.EnterCode[payload.url] = code;
      
      client.emit('EnterCode', code);
    }
  }
  @SubscribeMessage('getOffer')
  sendMessage(client: Socket, payload: OfferPayload) {
    console.log(payload.data);
    client.to(payload.userId.toString()).emit('getOffer', payload.data);

    // console.log(this.clients[payload.userId], '겟오퍼');
    //index 기반 interface 으로해서 index=client.id 로하고 value를 client와 user.id 로 하자
  }
}