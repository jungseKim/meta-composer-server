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
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseChatList } from './dto/response-chatList.dto';
import { Message } from 'src/entities/message.entity';

@Controller('api/chat')
@ApiTags('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiOperation({
    summary: 'RoomList 조회',
    description: '자신이 속해있는 리스트 조회',
  })
  @ApiResponse({
    status: 200,
    description: '각 채팅방에 마지막 메세지 같이 보내줌',
    type: ResponseChatList,
  })
  @Get('/roomList')
  @UseInterceptors(TransformResponseInterceptor)
  @UseGuards(JwtGuard)
  public async getRoomList(@UserDecorator() user: User) {
    return await this.chatService.getRoomList(user);
  }

  @ApiOperation({
    summary: 'message 페이지 네이션',
    description: '10개씩줌 ',
  })
  @ApiOkResponse({ status: 200, description: 'page별로', type: [Message] })
  @Get(':id/messages')
  @UseInterceptors(TransformResponseInterceptor)
  public async getChatRoomMessage(
    @Param('id') id: number,
    @Query('page') page: number,
  ) {
    return this.chatService.getChatRoomMeesage(id, page);
  }
}
