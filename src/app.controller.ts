import { Controller, Get, Param, Query, Res, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { Response } from "express";
import { ApiOperation } from "@nestjs/swagger";
import { UserDecorator } from "./decorators/user.decorator";
import { User } from "./entities/user.entity";
import { Cron, Interval, Timeout } from "@nestjs/schedule";
import moment from "moment";
import { createQueryBuilder } from "typeorm";
import { Concours } from "./entities/concours.entity";
import { ConcoursSignup } from "./entities/concoursSignup.entity";
import axios, { AxiosResponse } from "axios";
import { Payment } from "./entities/payment.entity";
import { AuthGuard } from "@nestjs/passport";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    console.log();
  }
  // @Cron("48 * * * * *")
  // @Timeout("timeoutTask", 200)
  async handleCron() {
    return this.appService.handleCorn();
  }

  @Get("lessons")
  @ApiOperation({
    summary: "결제 예시",
    description: "레슨 ID값을 넣어 강의에 등록하며 결제한다. ",
  })
  get(@Res() res: Response, @Query("id") id) {
    res.sendFile("abc.html", {
      root: "./src/",
    });
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("tensorflow")
  async tensorflow(@UserDecorator() user: User) {
    return this.appService.tensorflow(user);
  }
}
