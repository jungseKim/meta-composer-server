import { Controller, Get, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { Response } from "express";
import { ApiOperation } from "@nestjs/swagger";
import { UserDecorator } from "./decorators/user.decorator";
import { User } from "./entities/user.entity";
import { TasksService } from "./modules/tasks/tasks.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private tasksService: TasksService,
  ) {}

  @Get("test")
  getHello() {
    this.tasksService.signupNotification(null, 0, 3);
  }
  @Get("test2")
  getHell2() {
    this.tasksService.cancleSignNotification(null);
  }

  @Get("lessons/1")
  @ApiOperation({
    summary: "결제 예시",
    description: "레슨 ID값을 넣어 강의에 등록하며 결제한다. ",
  })
  get(@Res() res: Response) {
    res.sendFile("abc.html", {
      root: "./src/",
    });
  }
}
