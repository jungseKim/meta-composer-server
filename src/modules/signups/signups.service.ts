import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Signup } from "src/entities/signup.entity";
import { User } from "src/entities/user.entity";
import { getManager } from "typeorm";
import { SignupDayAndTimesService } from "../signup-day-and-times/signup-day-and-times.service";
import { SignuptimetablesRepository } from "../signup-timetables/signup-timetables.repository";
import { SignupTimetablesService } from "../signup-timetables/signup-timetables.service";
import { TasksService } from "../tasks/tasks.service";
import { SignupsRepository } from "./signups.repository";

@Injectable()
export class SignupsService {
  constructor(
    @InjectRepository(SignupsRepository)
    private signupsRepository: SignupsRepository,
    private tasksService: TasksService,
    private signupDayAndTimesService: SignupDayAndTimesService,
    private signupTimetablesService: SignupTimetablesService, //
  ) {}

  async signup(id, updateData, user: User): Promise<any> {
    console.log(updateData);
    // console.log("왜안나와?");
    const dayData = updateData.weekdays;
    const timeData = updateData.lessonTime;

    // const signup: Signup = await this.signupsRepository.signup(
    //   id,
    //   updateData,
    //   user,
    // );

    console.log(updateData);
    console.log("회원가입 데이터 확인?");
    console.log(updateData.weekdays);
    const existence = await this.signupsRepository
      .createQueryBuilder("signup")
      .where("signup.lessonId = :lessonid", { lessonid: +id })

      .andWhere("signup.userId = :userid", { userid: +user.id })
      // .andWhere("signup.weekdays = :weekdays", {
      //   weekdays: updateData.weekdays[weekday],
      // })
      // .andWhere("signup.lessonTime = :lessonTime", {
      //   lessonTime: updateData.lessonTime[lessonTimeP],
      // })
      .getOne();
    const signup = this.signupsRepository.create({
      merchant_uid: updateData.merchant_uid,
      lessonId: +id,
      userId: user.id,
      startdate: updateData.startdate,
      howManyMonth: +updateData.howManyMonth,
      // lessonTime: updateData.lessonTime[lessonTimeP],
      // weekdays: updateData.weekdays[weekday],
    });
    for (const weekday in updateData.weekdays) {
      for (const lessonTimeP in updateData.lessonTime) {
        console.log(updateData.weekdays[weekday]);
        console.log(updateData);
        console.log(updateData.merchant_uid + "구매고유번호");

        console.log(signup);
        console.log("폼데이터");

        //1. 시작날, 요일, 몇달을 기반으로 날짜들 도출
        const startdate = updateData.startdate;
        const time = updateData.lessonTime[lessonTimeP];

        const query = `SELECT DATE_ADD("${startdate}", 
    INTERVAL ${updateData.howManyMonth} MONTH)`;

        console.log(query);

        const entityManager = getManager();
        const endDate = await entityManager.query(`${query}`);

        console.log(endDate);
        // const enddate = endDate[0][Object.keys(endDate)];

        const endDateFinal = [Object.values(endDate[0])][0][0];
        //[{ 'DATE_ADD("2022-02-23", INTERVAL 1 MONTH)': '2022-03-23' }]
        console.log(endDateFinal + " 1달 증가한 날짜");
        ///테스트...

        //2. 시작날 ~ 시작날+몇달 안에 해당하는 요일 반환
        let day = updateData.weekdays[weekday];

        switch (day) {
          case "Sun":
            day = 1;
            break;
          case "Mon":
            day = 2;
            break;
          case "Tue":
            day = 3;
            break;
          case "Wed":
            day = 4;
            break;
          case "Thu":
            day = 5;
            break;
          case "Fri":
            day = 6;
            break;
          case "Sat":
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
        console.log(" 확인");

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
          console.log("no problem");
          await this.signupsRepository.save(signup);
        } else {
          console.log("already exist lesson and userid");
        }

        ///

        this.signupTimetablesService.createTimeTable({
          datesArray: datesArray,
          signup: signup,
          time: time,
          day: day,
          id: id,
          userId: user.id,
        });

        //위

        // const aa = axios.post("http://localhost:4000/api/signup-timetables", {
        //   datesArray: datesArray,
        //   signup: signup,
        //   time: time,
        //   day: day,
        //   id: id,
        // });

        // console.log(aa);
        // .andWhere("signup.merchant_uid =:mid",{mid:merchant_uid})
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

    this.signupDayAndTimesService.saveDayAndTimes(dayData, timeData, id, user);
    // await this.tasksService.signupNotificationTest(signup);
    return signup;
  }
  // async signup(id: number, updateData, user: User): Promise<Signup> {
  //   const signup = await this.signupsRepository.signupTest(
  //     id,
  //     updateData,
  //     user,
  //   );
  //   await this.tasksService.signupNotificationTest(signup);
  //   // return this.signupsRepository.signup(id, updateData, user);
  //   return signup;
  // }
}
