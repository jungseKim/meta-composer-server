import { ChatRoom } from "./../../entities/chatRoom.entity";
import { Signup } from "src/entities/signup.entity";
import { NotificationController } from "./notification.controller";
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { NotificationGateway } from "./notification.gateway";
import { NotificationService } from "./notification.service";
import { CustomNotification } from "src/entities/custom-notification.entity";
import { Message } from "src/entities/message.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      CustomNotification,
      Signup,
      Message,
      ChatRoom,
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
