import { EntityRepository, Repository } from "typeorm";

import { TimeTable } from "src/entities/timeTable.entity";
import { ConsoleLogger } from "@nestjs/common";

@EntityRepository(TimeTable)
export class TimeTablesRepository extends Repository<TimeTable> {
  async createTimeTable(updateData) {
    console.log(JSON.stringify(updateData.updateData) + "떳나ㅋㅋ");

    //for of문
    // for (const i of updateData.updateData.day) {
    //   let k = 0;
    //   const day = i;
    //   console.log(i);
    //   console.log(day + "====>>  updateData.day[i]");

    //   for (const j of updateData.updateData.time[k]) {
    //     const time = j;
    //     console.log(j);
    //     console.log(time + "====>>  updateData.time[i][j]");
    //     const createdTimeTale = this.create({
    //       lessonId: updateData.lessonId,
    //       day: day,
    //       time: time,
    //       IsEmpty: true,
    //     });
    //     await this.save(createdTimeTale);
    //   }
    //   k++;
    // }

    //just for loop

    for (let i = 0; i < updateData.updateData.day.length; i++) {
      const day = updateData.updateData.day[i];
      console.log(day + "====>>  updateData.day[i]");
      for (let j = 0; j < updateData.updateData.time[i].length; j++) {
        const time = updateData.updateData.time[i][j];
        console.log(time + "====>>  updateData.time[i][j]");
        const createdTimeTale = this.create({
          lessonId: updateData.lessonId,
          day: day,
          time: time,
          IsEmpty: true,
        });
        await this.save(createdTimeTale);
      }
    }

    //같은요일 같은시간 안들어가게.
  }
}

//ex
// 일월화수목 9 10 11 14 15 16
//2022-03-15 10:38:40

// {
//     "day": ["1","2","3","6","7"],
//     "time":[
//             ["08:00:00","10:00:00","11:00:00","12:00:00"],
//             ["08:00:00","10:00:00","18:00:00"],
//             ["08:00:00","10:00:00","13:00:00","15:00:00"],
//             ["08:00:00","10:00:00","13:00:00","14:00:00"],
//             ["08:00:00","10:00:00","13:00:00"]
//     ]

// }
