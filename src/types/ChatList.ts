import { Lesson } from 'src/entities/lesson.entity';
import { ChatRoom } from 'src/entities/chatRoom.entity';
export default interface ChatList {
  lessonChat: Lesson[] | null;
  userChatList: ChatRoom[] | null;
}
