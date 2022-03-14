import { UserDecorator } from 'src/decorators/user.decorator';
import { JwtGuard } from 'src/auth/jwt.guard';
import { ChatService } from './chat.service';
/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';

@Controller('api/chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/roomList')
  @UseGuards(JwtGuard)
  public async getRoomList(@UserDecorator() user: User) {
    return await this.chatService.getRoomList(user);
  }

  @Get(':id/messages')
  public async getChatRoomMessage(
    @Param('id') id: number,
    @Query('page') page: number,
  ) {
    return this.chatService.getChatRoomMeesage(id, page);
  }
}
