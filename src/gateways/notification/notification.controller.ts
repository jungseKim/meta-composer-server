import { getConnection } from "typeorm";
import { NotificationService } from "src/gateways/notification/notification.service";
import { JwtGuard } from "src/modules/auth/jwt.guard";
/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
import { UserDecorator } from "src/decorators/user.decorator";
import { User } from "src/entities/user.entity";
import { PageValidationPipe } from "../chatGateway/dto/page-validation.pipe";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CustomNotification } from "src/entities/custom-notification.entity";
import { NotificationInfoDto } from "./dto/notification.dto";

@ApiTags("notification")
@Controller("api/notification")
@UseGuards(JwtGuard)
@UseInterceptors(TransformResponseInterceptor)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @ApiOperation({
    summary: "알림 리스트",
    description: "순서:안읽은게 먼저, 최근께 먼저",
  })
  @ApiResponse({
    status: 200,
    description: "알림 리스트",
    type: [CustomNotification],
  })
  @Get("/list")
  public async getNotifitions(
    @UserDecorator() user: User,
    @Query("page", PageValidationPipe) page: number,
    @Query("perPage", PageValidationPipe) perPage: number,
  ) {
    return this.notificationService.getNotifitions(user, page, perPage);
  }

  @ApiOperation({
    summary: "알림 정보",
    description: "정보 보는순간 읽음 으로 바뀜",
  })
  @ApiResponse({
    status: 200,
    description: "알림 정보 join 된 다른테이블 정보까지",
    type: NotificationInfoDto,
  })
  @Get(":id/info")
  public async getNotifitionInfo(
    @UserDecorator() user: User,
    @Param("id") notiId: number,
  ) {
    return this.notificationService.getNotifitionInfo(user, notiId);
  }

  @ApiOperation({
    summary: "알림 삭제",
  })
  @ApiResponse({
    status: 200,
    description: "알림 정보 join 된 다른테이블 정보까지",
    type: NotificationInfoDto,
  })
  @Delete(":id/remove")
  public async deleteNotification(
    @UserDecorator() user: User,
    @Param("id") notiId: number,
  ) {
    return this.notificationService.deleteNotification(user, notiId);
  }
}
