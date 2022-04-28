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

  async getMyTimeTable(user): Promise<Signuptimetable[]> {
    const mySignups = await this.createQueryBuilder()
      .select("signup")
      .from(Signup, "signup")
      .where("signup.userId = :userId", { userId: user.id })
      .getMany();

    // console.log(mySignups);

    // signup의 id값들만 배열로 만듬
    const mySignupIds = mySignups.map((x) => x.id);

    console.log(mySignupIds);
    console.log("내꺼 수강목록");
    // 그 배열을 반복하여 where로 가져와서
    //ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ

    const mySignupIdArray = [];

    for (const Id in mySignupIds) {
      console.log(mySignupIds[Id]);
      const result = await this.createQueryBuilder("signuptimetable")
        .select("signuptimetable")
        .where("signuptimetable.signupId = :signupId", {
          signupId: mySignupIds[Id],
        })
        .getMany();

      mySignupIdArray.push(result);

      console.log("이게머노");
      console.log(result);
    }

    // mySignupIds.forEach(async (x) => {
    //   const result = await this.createQueryBuilder("signuptimetable")
    //     .select("signuptimetable")
    //     .where("signuptimetable.signupId = :signupId", { signupId: x })
    //     .getOne();
    //   console.log("이게머노");
    //   console.log(result);
    //   //1
    //   // 다시 push 함
    //   // mySignupIdArray.push(result);
    //   //2
    // });

    console.log("끝났노");

    // return json으로.
    console.log(JSON.stringify(mySignupIdArray));
    return mySignupIdArray;
    // const result = this.createQueryBuilder("signuptimetable")
    //
    //   .where("signuptimetable.lessonId = :signupId", { signupId: id })

    //   .execute();
  }
}
