import { Socket } from "socket.io";
import { User } from "src/entities/user.entity";
export class AuthenticatedSocket extends Socket {
  user: User;
}

export class ChatSocekt extends Socket {
  userId: number;
  chatRoomId: number;
}
export class LessonSocket extends AuthenticatedSocket {
  lessonId: number;
}

export class NotificationSocekt extends AuthenticatedSocket {
  chatRoomId: number;
}
