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

@EntityRepository(Signup)
export class SignupsRepository extends Repository<Signup> {
  async signup(id: number, updateData, user: User): Promise<Signup> {
    console.log(updateData);
    console.log(updateData.merchant_uid + "구매고유번호");

    const signup = this.create({
      merchant_uid: updateData.merchant_uid,
      lessonId: +id,
      userId: user.id,
      startdate: updateData.startdate,
      howManyMonth: +updateData.howManyMonth,
      lessonTime: updateData.lessonTime,
      weekdays: updateData.weekdays,
    });

    console.log(signup);

    const existence = await this.createQueryBuilder("signup")
      .where("signup.lessonId = :lessonid", { lessonid: +id })

      .andWhere("signup.userId = :userid", { userid: +user.id })
      .getOne();

    //1. 시작날, 요일, 몇달을 기반으로 날짜들 도출
    const startdate = updateData.startdate;
    const time = updateData.lessonTime;
    delay(1);
    const query = `SELECT DATE_ADD("${startdate}", 
    INTERVAL ${updateData.howManyMonth} MONTH)`;

    console.log(query);
    delay(1);
    const entityManager = getManager();
    const endDate = await entityManager.query(`${query}`);

    console.log(endDate);
    // const enddate = endDate[0][Object.keys(endDate)];
    delay(1);
    const endDateFinal = [Object.values(endDate[0])][0][0];
    //[{ 'DATE_ADD("2022-02-23", INTERVAL 1 MONTH)': '2022-03-23' }]
    console.log(endDateFinal + " 1달 증가한 날짜");
    ///테스트...
    delay(1);
    //2. 시작날 ~ 시작날+몇달 안에 해당하는 요일 반환
    let day = updateData.weekdays;

    switch (day) {
      case "Sunday":
        day = 1;
        break;
      case "Monday":
        day = 2;
        break;
      case "Tuesday":
        day = 3;
        break;
      case "Wednesday":
        day = 4;
        break;
      case "Thursday":
        day = 5;
        break;
      case "Friday":
        day = 6;
        break;
      case "Saturday":
        day = 7;
        break;
    }

    //     const query2 = `SET @StartDateTime = "${startdate}" SET @EndDateTime = "${endDateFinal}"
    //      WITH RECURSIVE DateRange(Dates, DateWD)
    // AS (SELECT @StartDateTime, DayOfWeek(@StartDateTime)
    //  UNION ALL
    //   SELECT DATE_ADD(Dates, INTERVAL 1 DAY),
    //   DayOfWeek(DATE_ADD(Dates, INTERVAL 1 DAY))
    //   FROM  DateRange WHERE Dates < @EndDateTime)
    //    SELECT * FROM   DateRange WHERE  DateWD IN(${day})
    //    `;
    console.log(`'${startdate}'`);
    console.log(`'${endDateFinal}'`);
    console.log("ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ");

    // const query2 = `SET @StartDateTime = '${startdate}'`;

    // const query3 = `SET @EndDateTime = '${endDateFinal}'`;

    const query4 = `WITH RECURSIVE DateRange(Dates, DateWD) AS 
(
    SELECT '${startdate}', DayOfWeek('${startdate}') 
    UNION ALL
    SELECT DATE_ADD(Dates, INTERVAL 1 DAY), DayOfWeek(DATE_ADD(Dates, INTERVAL 1 DAY)) 
    FROM  DateRange 
    WHERE Dates < '${endDateFinal}'
)
SELECT * 
FROM   DateRange
WHERE  DateWD IN(${day}); 
       `;
    console.log(query4);

    // entityManager.query(`${query2}`);

    // entityManager.query(`${query3}`);

    const selectedDays = await entityManager.query(`${query4}`);

    console.log(selectedDays);
    console.log("<>~~~~");

    // console.log(Object.keys(selectedDays[0]));

    const datesArray = [];

    for (let i = 0; i < selectedDays.length; i++) {
      const eachDay = Object.values(selectedDays[i])[0];
      datesArray.push(eachDay);
    }

    console.log(datesArray);

    if (!existence) {
      await this.save(signup);
    } else {
      console.log("already exist lesson and userid");
    }

    ///
    delay(1);
    delay(100);
    delay(100);
    axios.post("http://localhost:4000/api/signup-timetables", {
      datesArray: datesArray,
      signup: signup,
      time: time,
      day: day,
      id: id,
    });

    // const aa = axios.post("http://localhost:4000/api/signup-timetables", {
    //   datesArray: datesArray,
    //   signup: signup,
    //   time: time,
    //   day: day,
    //   id: id,
    // });

    // console.log(aa);
    // .andWhere("signup.merchant_uid =:mid",{mid:merchant_uid})

    return signup;
  }

  // axios.post("http://localhost:4000/api/time-tables", {
  //   updateData,
  // });

  // console.log(id, updateData, user);

  //1. signup-timetable에 signup시 보내준 시작날, 요일 ,몇달 전송
  //2. 시작날 ~ 시작날+몇달 안에 해당하는 요일 반환
  //3. signuptimetable에 차곡차곡저장. 출석칼럼 default false
  //3-1. attendance 삭제
  //3-2. signuptimetable 에 출석  boolean 추가
  //3-3. 노션에 추가
  //4. time-table 에 해당 시간대 비활성화 (isEmpty = false)
}
