import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpService,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserDecorator } from "src/decorators/user.decorator";
import { Signup } from "src/entities/signup.entity";
import { Teacher } from "src/entities/teacher.entity";
import { User } from "src/entities/user.entity";
import { createQueryBuilder, getRepository, QueryBuilder } from "typeorm";
import { SignupsRepository } from "./signups.repository";
import { SignupsService } from "./signups.service";
import axios, { AxiosResponse } from "axios";
import { Lesson } from "src/entities/lesson.entity";
import { Connection } from "typeorm";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
import { NotificationService } from "src/gateways/notification/notification.service";
@Controller("api/signups")
@ApiTags("수강 등록 API")
export class SignupsController {
  constructor(
    private signupsService: SignupsService,
    private signupsRepository: SignupsRepository, // private  http: HttpCode
    private notificationService: NotificationService,
  ) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("/lessons/:id")
  @ApiOperation({
    summary: "수강 등록",
    description: `수강등록을 한다. id 는 레슨의 id값. merchant_uid 는 결제시 자동 등록됩니다.
    테스트를 위해서는,
    {
    "data" : {
    "merchant_uid":"test133332213",
    "startdate":"2022-02-01",
    "howManyMonth":5,
    "lessonTime":["08:00:00"],
    "weekdays":["Sat"]}
} 와 같이 merchant_uid 를 임의로 보내도 됩니다.
레슨타임과 요일은 배열로 보내주세요.
(form 으로 ["Sat","Sun"] 배열을 전송하면 도착할때는 "["Sat","Sun"]" 이 되는데 백엔드에서 처리합니다.)
    `,
  })
  @UseInterceptors(TransformResponseInterceptor)
  async signup(
    @Param("id", ParseIntPipe) id: number,
    @Body("data") updateData,
    @UserDecorator() user: User,
  ): Promise<any> {
    console.log(updateData);
    console.log("form data");
    const signup = await this.signupsService.signup(id, updateData, user);
    return this.notificationService.signupLesson(signup);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("/lessons/:id")
  @ApiOperation({
    summary: "수강 등록 정보 삭제",
    description: `수강 등록 정보 삭제. id 는 레슨의 id값
    {
    "data" : {
    "merchant_uid":"이건 결제시 자동 등록됨",
    "startdate":"2022-02-01",
    "howManyMonth":5,
    "lessonTime":["14:00:00","15:00:00","16:00:00"],
    "weekdays":["Sun","Mon"]}
}
    
    `,
  })
  async signupCancel(
    @Param("id") id: number,
    @UserDecorator() user: User,
  ): Promise<any> {
    createQueryBuilder("signup")
      .delete()
      .where("signup.lessonId = :lessonid", { lessonid: +id })
      .andWhere("signup.userId = :userid", { userid: user.id })
      .execute();
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("/lessons/check/:id")
  @ApiOperation({
    summary: "레슨 개설자가 자신의 강의에 수강신청 방지 (사용금지)",
    description:
      "수강 등록 전에 수강신청을 하는 유저와 레슨 개설자가 같은지 확인하는 API",
  })
  async checkUser(
    @Param("id") id: number,
    @UserDecorator() user: User,
  ): Promise<any> {
    //if 요청하는사람의 id값과
    //updateData.lessonId로 레슨을 찾아서 그 레슨의 teacherId로  userId 검색 한 값이
    //같으면 false

    const selectedLesson = await getRepository(Lesson)
      .createQueryBuilder("lesson")
      .where("lesson.id = :id", { id: +id })
      .getOne();

    console.log(selectedLesson);
    //lesson.teacherId로 teacher table 에서 id값 찾기

    const teacherId = selectedLesson.teacherId;
    console.log(teacherId);
    //teacher id값으로 teacher table 에서 userId값 찾기

    const foundTeacher = await getRepository(Teacher)
      .createQueryBuilder("teacher")
      .where("teacher.id = :id", {
        id: teacherId,
      })
      .getOne();
    console.log(foundTeacher);

    const foundUserId = foundTeacher.userId;
    console.log(foundUserId);

    if (user.id == foundUserId) {
      console.log("자신의 강의는 결제 불가능합니다.");

      return "결제취소";
    }
    console.log("결제진행가능");
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("mine")
  @ApiOperation({
    summary: "나의 수강목록",
    description: "나의 수강목록",
  })
  async myLessonList(@UserDecorator() user: User) {
    return this.signupsService.myLessonList(user);
  }

  //나의 수강등록 목록
}
