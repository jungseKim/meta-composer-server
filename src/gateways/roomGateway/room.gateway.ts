import { Server, Socket } from 'socket.io';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { customAlphabet } from 'nanoid';
import EnterPayload from 'src/types/EnterPayload';

@WebSocketGateway(4400, {
  namespace: 'room',
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class RoomGateway {
  EnterCode: Record<string, string>;

  @WebSocketServer()
  sever: Server;
  //오큘러스 고려 없이 만들었을때
  @SubscribeMessage('setInit')
  handleMessage(client: Socket, payload: EnterPayload) {
    if (this.EnterCode[payload.url]) {
      if (this.EnterCode[payload.url] === payload.code) {
        client.join(payload.url);
        delete this.EnterCode[payload.url];
      } else {
        client.emit('CodeError');
      }
    } else {
      client.join(payload.url);

      const char = customAlphabet('ABCDEFG', 2)();
      const num = Math.random().toString().slice(2, 4);
      const codeArr = char.split('').concat(num.split(''));
      const code = codeArr.sort(() => Math.random() - 0.5).join('');

      this.EnterCode[payload.url] = code;
      client.emit('EnterCode', code);
    }
  }
}
