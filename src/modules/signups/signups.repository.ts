import { HttpCode } from "@nestjs/common";
import { Signup } from "src/entities/signup.entity";
import { User } from "src/entities/user.entity";
import {
  EntityRepository,
  getRepository,
  Repository,
  getManager,
} from "typeorm";
import axios, { AxiosResponse } from "axios";
import { ApiExtraModels } from "@nestjs/swagger";
import { delay } from "rxjs";
import { weekdays } from "moment";

@EntityRepository(Signup)
export class SignupsRepository extends Repository<Signup> {
  // async signupTest(id: number, data, user: User): Promise<Signup> {
  //   const updateData = JSON.parse(data);
  //   const startDate: string = updateData.startdate;
  //   console.log(updateData.weekdays);
  //   const signup = this.create({
  //     merchant_uid: updateData.merchant_uid,
  //     lessonId: +id,
  //     userId: user.id,
  //     startdate:
  //       "2022-" +
  //       new Date(startDate).getMonth() +
  //       "-" +
  //       new Date(startDate).getDay(),
  //     howManyMonth: +updateData.howManyMonth,
  //     lessonTime: updateData.lessonTime,
  //     weekdays: updateData.weekdays,
  //   }).save();
  //   return signup;
  // }
  // async signup(id: number, updateData, user: User): Promise<any> {}
}
