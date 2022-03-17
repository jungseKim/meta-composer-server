import { type } from "os";
import { PageValidationPipe } from "./dto/page-validation.pipe";
import { SendMessageDto } from "./dto/send-message.dto";
import { UserDecorator } from "src/decorators/user.decorator";

import { ChatService } from "./chat.service";
/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
import {
  ApiBasicAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ResponseChatList } from "./dto/response-chatList.dto";
import { Message } from "src/entities/message.entity";
import { ChatRoomInfoDto } from "./dto/chat-info.dto";
import { ChatRoom } from "src/entities/chatRoom.entity";
import { JwtGuard } from "src/modules/auth/jwt.guard";

@Controller("api/chat")
@ApiTags("chat")
export class ChatController {
  constructor(private chatService: ChatService) {}

  @ApiOperation({
    summary: "RoomList 조회",
    description: "자신이 속해있는 리스트 조회",
  })
  @ApiResponse({
    status: 200,
    description: "각 채팅방에 마지막 메세지 같이 보내줌",
    type: ResponseChatList,
  })
  @Get("/roomList")
  @UseInterceptors(TransformResponseInterceptor)
  @UseGuards(JwtGuard)
  public async getRoomList(@UserDecorator() user: User) {
    return await this.chatService.getRoomList(user);
  }

  @ApiOperation({
    summary: "message 페이지 네이션",
    description: "10개씩줌 ",
  })
  @ApiOkResponse({ status: 200, description: "page별로", type: [Message] })
  @Get(":roomId/messages")
  @UseGuards(JwtGuard)
  @UseInterceptors(TransformResponseInterceptor)
  public async getChatRoomMessage(
    @Param("roomId") roomId: number,
    @Query("page", PageValidationPipe) page: number,
    @Query("perPage", PageValidationPipe) perPage: number,
  ) {
    return this.chatService.getChatRoomMeesage(roomId, page, perPage);
  }

  @ApiOperation({
    summary: "chatting room 에 대한 정보 ",
    description: "(강사, 유저) join 한 값 방",
  })
  @ApiOkResponse({
    status: 200,
    description: "page별로",
    type: ChatRoomInfoDto,
  })
  @Get(":roomId/chatRoomInfo")
  @UseGuards(JwtGuard)
  @UseInterceptors(TransformResponseInterceptor)
  public async getChatRoomInfo(
    @UserDecorator() user: User,
    @Param("roomId") roomId: number,
  ) {
    return this.chatService.getChatRoomInfo(user, roomId);
  }

  @ApiOperation({
    summary: "채팅방 생성 ",
    description: "유저가 레슨채팅방에 대한 채팅방임 수강 안하면 안됨",
  })
  @ApiOkResponse({
    status: 200,
    description: "생성된 채팅방 정보",
    type: ChatRoom,
  })
  @Post(":lessonId/chatRoom")
  @UseGuards(JwtGuard)
  @UseInterceptors(TransformResponseInterceptor)
  public async createChatRoom(
    @UserDecorator() user: User,
    @Param("lessonId") lessonId: number,
  ) {
    return this.chatService.createChatRoom(user.id, lessonId);
  }

  @ApiOperation({
    summary: "메세지 보내기 ",
    description: "없는 룸 일경우 false 리턴",
  })
  @ApiOkResponse({
    status: 200,
    description: "보낸메세지 리턴",
    type: Message,
  })
  @Post(":chatRoomId/sendMessage")
  @UseGuards(JwtGuard)
  @UseInterceptors(TransformResponseInterceptor)
  public async sendMessage(
    @UserDecorator() user: User,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.chatService.saveMessage(user, sendMessageDto);
  }
}
