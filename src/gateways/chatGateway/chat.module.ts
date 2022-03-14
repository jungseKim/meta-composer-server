import { ChatService } from './chat.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { ChatRoom } from 'src/entities/chatRoom.entity';
import { Message } from 'src/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Teacher, Lesson, ChatRoom, Message]),
  ],
  controllers: [],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
