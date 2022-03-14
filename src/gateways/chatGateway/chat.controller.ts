import { ChatService } from './chat.service';
/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('api/chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get(':id/messages')
  public async getChatRoomMessage(
    @Param('id') id: number,
    @Query('page') page: number,
  ) {
    return this.chatService.getChatRoomMeesage(id, page);
  }
}
