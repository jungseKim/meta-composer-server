import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpService,
  Param,
  Post,
  Req,
  UseGuards,
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
@Controller("api/signups")
@ApiTags("수강 등록 API")
export class SignupsController {
  constructor(
    private signupsService: SignupsService,
    private signupsRepository: SignupsRepository, // private  http: HttpCode
  ) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("/lessons/:id")
  @ApiOperation({
    summary: "수강 등록",
    description: "수강등록을 한다. id 는 레슨의 id값",
  })
  async signup(
    @Param("id") id: number,
    @Body() updateData,
    @UserDecorator() user: User,
  ): Promise<Signup> {
    return this.signupsService.signup(id, updateData, user);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("/lessons/:id")
  @ApiOperation({
    summary: "수강 등록 정보 삭제",
    description: "수강 등록 정보 삭제. id 는 레슨의 id값",
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
}
