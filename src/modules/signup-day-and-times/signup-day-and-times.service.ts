import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "src/entities/payment.entity";
import { Signup } from "src/entities/signup.entity";

import { SignupDayAndTime } from "src/entities/signupDayAndTime.entity";
import { User } from "src/entities/user.entity";
import { getRepository, Repository } from "typeorm";
import { SignupsRepository } from "../signups/signups.repository";

@Injectable()
export class SignupDayAndTimesService {
  constructor(
    @InjectRepository(SignupDayAndTime)
    private signupDayAndTimesRepository: Repository<SignupDayAndTime>, // private signupsRepository: SignupsRepository,
  ) {}

  // lessonTime;
  // weekdays;
  async saveDayAndTimes(dayData, timeData, id: number, user: User) {
    console.log(dayData, timeData, id, user);
    console.log("폼데이터");

    const existence = await getRepository(Signup)
      .createQueryBuilder("signup")
      .where("signup.lessonId = :lessonId", {
        lessonId: id,
      })
      .andWhere("signup.userId = :userId", {
        userId: user.id,
      })
      .getOne();

    console.log(existence);

    for (const weekday in dayData) {
      for (const lessonTimeP in timeData) {
        const signupDayAndTime = this.signupDayAndTimesRepository
          .create({
            weekdays: dayData[weekday],
            lessonTime: timeData[lessonTimeP],
            signupId: existence.id,
          })
          .save();
      }
    }
  }
}
