import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SetCookieInterceptor } from "src/common/interceptors/set-cookie.interceptor";
import { UserDecorator } from "src/decorators/user.decorator";
import { User } from "src/entities/user.entity";
import { AuthService } from "../auth/auth.service";

import { Request as Re, Response } from "express";
import { createQueryBuilder, getRepository } from "typeorm";
import { JwtRefreshGuard } from "../auth/jwt-refresh.guard";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
import { JwtGuard } from "../auth/jwt.guard";
@Controller("api/admin")
@ApiTags("관리자/인증 API")
export class AdminController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @ApiOperation({
    summary: "관리자 등록",
    description: "관리자 등록",
  })
  @ApiResponse({ status: 200, description: "관리자 등록 완료", type: User })
  @UseGuards(JwtGuard)
  @UseInterceptors(TransformResponseInterceptor)
  async googleAuth(@UserDecorator() user: User, @Body("pass") pass: string) {
    console.log(pass);
    if (pass == "1234") {
      if (user.is_admin == false) {
        await createQueryBuilder()
          .update(User)
          .set({
            is_admin: true,
          })
          .where("id = :id", { id: user.id })
          .execute();
      } else {
        throw new HttpException(
          "You are already admin",
          HttpStatus.BAD_REQUEST,
        );
      }
      return true;
    } else {
      throw new HttpException("You are not admin", HttpStatus.FORBIDDEN);
    }
  }
}
