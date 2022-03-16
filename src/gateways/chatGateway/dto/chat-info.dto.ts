import { ChatRoom } from "../../../entities/chatRoom.entity";
import { Teacher } from "src/entities/teacher.entity";
import { PickType, ApiProperty } from "@nestjs/swagger";
import { Lesson } from "src/entities/lesson.entity";
import { time } from "console";
import { Message } from "src/entities/message.entity";
import { User } from "src/entities/user.entity";

export class userLessonDto extends PickType(Lesson, [
  "id",
  "introduce",
  "length",
  "price",
  "name",
  "type",
  "timeTables",
  "chatRooms",
  "teacherId",
] as const) {
  @ApiProperty({ type: Teacher })
  __teacher__: Teacher;
}

export class TeacherRoomInfoDto extends PickType(ChatRoom, [
  "id",
  "userId",
  "lessonId",
  "created_at",
  "updated_at",
] as const) {
  @ApiProperty({
    type: User,
    description: "마지막으로 한채팅",
  })
  user: User;
  @ApiProperty({ type: Message, isArray: true })
  __messages__: Message[];
}

export class ChatRoomDto extends PickType(ChatRoom, [
  "id",
  "userId",
  "lessonId",
  "created_at",
  "updated_at",
] as const) {
  @ApiProperty({
    type: Message,
    isArray: true,
    description: "마지막으로 한채팅",
  })
  __messages__: Message;
  @ApiProperty({ type: userLessonDto })
  __lesson__: userLessonDto;
}

export class ChatRoomInfoDto extends PickType(ChatRoom, [
  "id",
  "userId",
  "lessonId",
  "created_at",
  "updated_at",
] as const) {
  @ApiProperty({
    type: User,
    description: "마지막으로 한채팅",
  })
  user: User;
  @ApiProperty({
    type: Lesson,
    description: "마지막으로 한채팅",
  })
  __lesson__: Lesson;
}

export class LessonDto extends PickType(Lesson, [
  "id",
  "introduce",
  "length",
  "price",
  "name",
  "type",
  "timeTables",
  "chatRooms",
  "teacherId",
] as const) {
  @ApiProperty({ type: TeacherRoomInfoDto, isArray: true })
  chatRooms: ChatRoom[];
}
