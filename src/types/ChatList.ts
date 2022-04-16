import { Lesson } from "src/entities/lesson.entity";
import { ChatRoom } from "src/entities/chatRoom.entity";
import { Message } from "src/entities/message.entity";
export default interface ChatList {
  lessonChat: Lesson[] | null;
  userChatList: ChatRoom[] | null;
}

export interface CustomChatRoom {
  entities: ChatRoom[];
  raw: MayRaw[];
}
interface MayRaw {
  chatRoom_id: string;
  message: Message[];
}
