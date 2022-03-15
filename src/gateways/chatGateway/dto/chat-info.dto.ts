import { LessonDTO } from '../../../lessons/dto/lessons.dto';
import { ChatRoom } from '../../../entities/chatRoom.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { PickType, ApiProperty } from '@nestjs/swagger';
import { Lesson } from 'src/entities/lesson.entity';
import { time } from 'console';
import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';

export class ChatRoomDto extends PickType(ChatRoom, [
  'id',
  'userId',
  'lessonId',
  'created_at',
  'updated_at',
] as const) {
  @ApiProperty({
    type: Message,
    isArray: true,
    description: '마지막으로 한채팅',
  })
  messages: Message;
}

export class ChatRoomInfoDto extends PickType(ChatRoom, [
  'id',
  'userId',
  'lessonId',
  'created_at',
  'updated_at',
] as const) {
  @ApiProperty({
    type: Lesson,
    description: '마지막으로 한채팅',
  })
  lesson: Lesson;
  @ApiProperty({
    type: User,
    description: '마지막으로 한채팅',
  })
  user: User;
}

export class LessonDto extends PickType(Lesson, [
  'id',
  'introduce',
  'length',
  'price',
  'name',
  'type',
  'timeTable',
  'chatRooms',
  'teacherId',
] as const) {
  @ApiProperty({ type: () => ChatRoomDto, isArray: true })
  chatRooms: Promise<ChatRoom[]>;
}
