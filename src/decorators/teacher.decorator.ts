import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { userInfo } from "os";
import { Teacher } from "src/entities/teacher.entity";

import { TeachersRepository } from "src/modules/teachers/teachers.repository";
import { Connection, getConnection } from "typeorm";
export const TeacherDecorator = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    console.log(request.user + "크아악윽");
    console.log("왜두번?");

    // const teachersRepository = new TeachersRepository();
    const teacher = await getConnection()
      .createQueryBuilder()
      .select("teacher")
      .from(Teacher, "teacher")
      .where("userId = :id", { id: request.user.id })
      .getOne();

    if (teacher) {
      console.log(`hi ${teacher.id}당신은 강사`);
      //1. 강사 수정으로 이거동작 확인
      //2. 레슨부터 권한부여
      return teacher.id;
    } else if (!teacher) {
      console.log("강사가 아님");
      throw new HttpException("You are not teacher", HttpStatus.FORBIDDEN);
    }
  },
);
