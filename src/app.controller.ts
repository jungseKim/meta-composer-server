import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { Response } from "express";
import { ApiOperation } from "@nestjs/swagger";
import { UserDecorator } from "./decorators/user.decorator";
import { User } from "./entities/user.entity";
import { TasksService } from "./modules/tasks/tasks.service";

import { Cron, Interval, Timeout } from "@nestjs/schedule";
import { createQueryBuilder, getRepository } from "typeorm";
import { Concours } from "./entities/concours.entity";
import { ConcoursSignup } from "./entities/concoursSignup.entity";
import axios, { AxiosResponse } from "axios";
import { Payment } from "./entities/payment.entity";
import { AuthGuard } from "@nestjs/passport";
import { spawn } from "child_process";
import { TransformResponseInterceptor } from "./common/interceptors/transformResponse.interceptor";
import { SearchHistoriesService } from "./modules/search-histories/search-histories.service";
import { ViewcountsService } from "./modules/viewcounts/viewcounts.service";
import { SignupsService } from "./modules/signups/signups.service";
import { callbackify } from "util";
import { buffer } from "stream/consumers";
import { copyFileSync } from "fs";
import { max } from "rxjs";
import { Lesson } from "./entities/lesson.entity";
import { OptionalJwtAuthGuard } from "./modules/auth/optionalJwt.guard";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private tasksService: TasksService,
    private searchHistoriesService: SearchHistoriesService,
    private viewcountsService: ViewcountsService,
    private signupsService: SignupsService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post("py")
  @ApiOperation({
    summary: "사용자에게 추천레슨 5개",
    description:
      "사용자 선호도 기반하여 사용자에게 5개 레슨 추천한다. 로그인 안되어있으면 신규강좌를 보여준다.",
  })
  @UseInterceptors(TransformResponseInterceptor)
  async testPy(@UserDecorator() user: User, @Res() res): Promise<any> {
    if (user) {
      const mySearchHistoryLog =
        await this.searchHistoriesService.mySearchHistory(user);
      const myViewHistoryLog = await this.viewcountsService.myViewHistory(user);
      const mySignList = await this.signupsService.myLessonList(user);

      // const typeList = ["Sonata", "Etudes", "Waltzes", "Nocturnes", "Marches"];

      // console.log("검색내역" + mySearchHistoryLog);

      const mySearchHistoryLog_Sonata = await mySearchHistoryLog.filter(
        (element) => "Sonata" === element,
      ).length;

      const mySearchHistoryLog_Etudes = await mySearchHistoryLog.filter(
        (element) => "Etudes" === element,
      ).length;
      const mySearchHistoryLog_Waltzes = await mySearchHistoryLog.filter(
        (element) => "Waltzes" === element,
      ).length;
      const mySearchHistoryLog_Nocturnes = await mySearchHistoryLog.filter(
        (element) => "Nocturnes" === element,
      ).length;
      const mySearchHistoryLog_Marches = await mySearchHistoryLog.filter(
        (element) => "Marches" === element,
      ).length;

      // console.log(mySearchHistoryLog_Sonata);
      // console.log(mySearchHistoryLog_Etudes);
      // console.log(mySearchHistoryLog_Waltzes);
      // console.log(mySearchHistoryLog_Nocturnes);
      // console.log(mySearchHistoryLog_Marches);

      //

      // console.log("조회내역" + myViewHistoryLog);

      const myViewHistoryLog_Sonata = await myViewHistoryLog.filter(
        (element) => "Sonata" === element,
      ).length;

      const myViewHistoryLog_Etudes = await myViewHistoryLog.filter(
        (element) => "Etudes" === element,
      ).length;
      const myViewHistoryLog_Waltzes = await myViewHistoryLog.filter(
        (element) => "Waltzes" === element,
      ).length;
      const myViewHistoryLog_Nocturnes = await myViewHistoryLog.filter(
        (element) => "Nocturnes" === element,
      ).length;
      const myViewHistoryLog_Marches = await myViewHistoryLog.filter(
        (element) => "Marches" === element,
      ).length;
      // console.log(myViewHistoryLog_Sonata);
      // console.log(myViewHistoryLog_Etudes);
      // console.log(myViewHistoryLog_Waltzes);
      // console.log(myViewHistoryLog_Nocturnes);
      // console.log(myViewHistoryLog_Marches);

      //

      // console.log("수강목록" + mySignList);

      const mySignList_Sonata = mySignList.filter(
        (element) => "Sonata" === element,
      ).length;

      const mySignList_Etudes = mySignList.filter(
        (element) => "Etudes" === element,
      ).length;
      const mySignList_Waltzes = mySignList.filter(
        (element) => "Waltzes" === element,
      ).length;
      const mySignList_Nocturnes = mySignList.filter(
        (element) => "Nocturnes" === element,
      ).length;
      const mySignList_Marches = mySignList.filter(
        (element) => "Marches" === element,
      ).length;

      // console.log(mySignList_Sonata);
      // console.log(mySignList_Etudes);
      // console.log(mySignList_Waltzes);
      // console.log(mySignList_Nocturnes);
      // console.log(mySignList_Marches);

      //
      const user_Sonata =
        mySearchHistoryLog_Sonata + myViewHistoryLog_Sonata + mySignList_Sonata;
      const user_Etudes =
        mySearchHistoryLog_Etudes + myViewHistoryLog_Etudes + mySignList_Etudes;
      const user_Waltzes =
        mySearchHistoryLog_Waltzes +
        myViewHistoryLog_Waltzes +
        mySignList_Waltzes;
      const user_Nocturnes =
        mySearchHistoryLog_Nocturnes +
        myViewHistoryLog_Nocturnes +
        mySignList_Nocturnes;
      const user_Marches =
        mySearchHistoryLog_Marches +
        myViewHistoryLog_Marches +
        mySignList_Marches;

      console.log(user_Sonata + `  : ${user.username}  : user_Sonata`);
      console.log(user_Etudes + `  : ${user.username}  : user_Etudes`);
      console.log(user_Waltzes + `  : ${user.username}  : user_Waltzes`);
      console.log(user_Nocturnes + `  : ${user.username}  : user_Nocturnes`);
      console.log(user_Marches + `  : ${user.username}  : user_Marches`);

      console.log("hello py");
      // parameter 로 넣어줄것.
      // 1. 검색기록  - 완료
      // 2. 조회기록
      // 3. 수강등록내역

      const pythonProcess = spawn("python", [
        "test.py",
        user.username,
        user_Sonata,
        user_Etudes,
        user_Waltzes,
        user_Nocturnes,
        user_Marches,
      ]);

      pythonProcess.stdout.on("data", async (data) => {
        console.log(".py check");
        // console.log(`${data}`);

        // const result = res.send(data);

        const parsed_data = JSON.parse(data);
        // console.log(parsed_data);
        // console.log(Object.keys(parsed_data));
        const recommend_keys = Object.keys(parsed_data);
        const integer_keys = recommend_keys.map((x) => +x);
        // console.log(integer_keys);
        const max_recommend_point = Math.max(...integer_keys);
        console.log(max_recommend_point + " : recommend_point");
        const result_recommendation =
          parsed_data[max_recommend_point.toString()];
        // const result_recommendation = parsed_data["18.57679107165652"];
        console.log((await result_recommendation) + " : 로 추천되었습니다");
        const recommend_lesson = await getRepository(Lesson)
          .createQueryBuilder("lesson")
          .where("type = :type", { type: result_recommendation })
          .orderBy("lesson.id", "DESC")
          .take(5)
          .getMany();

        res.send([
          { "recommended genre: ": result_recommendation },
          recommend_lesson,
        ]);

        // return this.appService.py_recommend(await result_recommendation);
      });
    } else if (!user) {
      const recommend_for_guest = await getRepository(Lesson)
        .createQueryBuilder("lesson")
        .orderBy("lesson.id", "DESC")
        .take(5)
        .getMany();
      res.send([
        { "recommended genre: ": "로그인하면 추천해드립니다." },
        recommend_for_guest,
      ]);
    }
  }

  @Get("test")
  getHello() {
    this.tasksService.signupNotification(null, 0, 1);
  }
  @Get("test2")
  getHell2() {
    this.tasksService.cancleSignNotification(null);
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

  // @UseGuards(AuthGuard("jwt"))
  // @Get("tensorflow")
  // async tensorflow(@UserDecorator() user: User) {
  //   return this.appService.tensorflow(user);
  // }

  // @Get("piano")
  // //이미지테스트
  // hi() {
  //   axios.get("https://source.unsplash.com/featured/?piano").then((data) => {
  //     console.log(data.request.res.req._redirectable._options.href);
  //   });
  // }
}
