import { Signuptimetable } from "src/entities/signuptimetable.entity";
import { Signup } from "../../entities/signup.entity";
import { EntityRepository, Repository } from "typeorm";
import { delay } from "rxjs";
import { json } from "stream/consumers";
import { getConnection } from "typeorm";
import { TimeTable } from "src/entities/timeTable.entity";

@EntityRepository(Signuptimetable)
export class SignuptimetablesRepository extends Repository<Signuptimetable> {
  async createTimeTable(updateData) {
    //분해해서, 하나하나 저장

    console.log(updateData);

    for (const date in updateData.datesArray) {
      const timetable = this.create({
        signupId: updateData.signup.id,
        time: updateData.datesArray[date] + " " + updateData.time,
        userId: updateData.userId,
      });
      // console.log("1회성");
      // console.log(updateData.time + " 시간입니다");
      console.log(updateData.datesArray[date]);
      console.log(timetable);
      delay(0.00000001);
      timetable.save();
    }
    //1.요일을 가져온다 시간을가져온다

    //2.timetable 에서 시간과 요일으로 검색한다
    console.log(updateData.day);
    console.log(updateData.time);
    let day;

    switch (updateData.day) {
      case 1:
        day = "Sun";
        break;
      case 2:
        day = "Mon";
        break;
      case 3:
        day = "Tue";
        break;
      case 4:
        day = "Wed";
        break;
      case 5:
        day = "Thu";
        break;
      case 6:
        day = "Fri";
        break;
      case 7:
        day = "Sat";
        break;
    }
    console.log(day);
    console.log(updateData.id + "<<<-- 레슨아이디 ");
    this.createQueryBuilder()
      .update(TimeTable)
      .set({
        signupId: updateData.signup.id,
      })
      .where("time_table.day = :day", { day: day })
      .andWhere("time_table.time = :time", { time: updateData.time })
      .andWhere("time_table.lessonId = :lessonId", {
        lessonId: +updateData.id,
      })
      .execute();

    //3.timetable 에 isempty false한다.
  }

  // async getMyTimeTable(user): Promise<Signup[]> {
  //   const mySignups = await this.createQueryBuilder("signup")
  //     .leftJoinAndSelect("signup.signupDayAndTimes", "signupDayAndTimes")
  //     .innerJoinAndSelect("signup.lesson", "signup")
  //     .where("signup.userId = :userId", { userId: user.id })
  //     .getMany();

  //   return mySignups;
  // const result = this.createQueryBuilder("signuptimetable")
  //
  //   .where("signuptimetable.lessonId = :signupId", { signupId: id })

  //   .execute();
  // }
}
