import { ChatList2 } from 'src/types/ChatList';
import { ChatRoom } from 'src/entities/chatRoom.entity';
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
import { TransformResponseInterceptor } from 'src/common/interceptors/transformResponse.interceptor';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('api/chat')
@ApiTags('')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiOperation({
    summary: 'RoomList 조회',
    description: '자신이 속해있는 리스트 조회',
  })
  @ApiResponse({ status: 200, description: '룸 조회 완료', type: ChatList })
  @Get('/roomList')
  @UseInterceptors(TransformResponseInterceptor)
  @UseGuards(JwtGuard)
  public async getRoomList(@UserDecorator() user: User) {
    return await this.chatService.getRoomList(user);
  }

  @ApiOperation({
    summary: 'RoomList 조회',
    description: '자신이 속해있는 리스트 조회',
  })
  @ApiResponse({ status: 200, description: '룸 조회 완료', type: ChatRoom2 })
  @Get(':id/messages')
  @UseInterceptors(TransformResponseInterceptor)
  public async getChatRoomMessage(
    @Param('id') id: number,
    @Query('page') page: number,
  ) {
    return this.chatService.getChatRoomMeesage(id, page);
  }
}
