import { Socket } from "socket.io";
export class ChatSocekt extends Socket {
  userId: number;
  chatRoomId: number;
}
export class LessonSocket extends Socket {
  userId: number;
}
