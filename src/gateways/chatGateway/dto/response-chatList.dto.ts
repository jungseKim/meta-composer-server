import { ApiProperty } from '@nestjs/swagger';
import { ChatRoomDto, LessonDto } from './chat-info.dto';
import { Lesson } from 'src/entities/lesson.entity';

export class ResponseChatList {
  @ApiProperty({ type: LessonDto, isArray: true })
  LessonList: LessonDto[];
  @ApiProperty({ type: [ChatRoomDto] })
  userChatList: ChatRoomDto;
}
