import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Lesson } from "src/entities/lesson.entity";
import { Teacher } from "src/entities/teacher.entity";
import { ChatRoom } from "src/entities/chatRoom.entity";
import { Message } from "src/entities/message.entity";
import { ChatController } from "./chat.controller";
import { NotificationModule } from "src/gateways/notification/notification.module";
import { Signup } from "src/entities/signup.entity";

@Module({
  imports: [
    NotificationModule,
    TypeOrmModule.forFeature([
      User,
      Teacher,
      Lesson,
      ChatRoom,
      Message,
      Signup,
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
