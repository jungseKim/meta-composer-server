import { getConnection } from "typeorm";
import { NotificationService } from "src/gateways/notification/notification.service";
import { JwtGuard } from "src/modules/auth/jwt.guard";
/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
import { UserDecorator } from "src/decorators/user.decorator";
import { User } from "src/entities/user.entity";

@Controller("api/notification")
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get("/")
  @UseGuards(JwtGuard)
  @UseInterceptors(TransformResponseInterceptor)
  public async getNotifitions(
    @UserDecorator() user: User,
    @Query("page") page: number,
    @Query("perPage") perPage: number,
  ) {
    return this.notificationService.getNotifitions(user, page, perPage);
  }
}
