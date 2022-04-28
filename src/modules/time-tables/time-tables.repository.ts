import { EntityRepository, getRepository, Repository } from "typeorm";

import { TimeTable } from "src/entities/timeTable.entity";
import { ConsoleLogger } from "@nestjs/common";

@EntityRepository(TimeTable)
export class TimeTablesRepository extends Repository<TimeTable> {
  async createTimeTable(updateData) {
    console.log(JSON.stringify(updateData.updateData) + "떳나ㅋㅋ");
    console.log(updateData.updateData.time[0]);

    console.log(updateData.updateData.time);
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

    for (let i = 0; i < updateData.updateData.day[0].length; i++) {
      const day = updateData.updateData.day[0][i];
      console.log(day + "====>>  updateData.day[i]");
      for (let j = 0; j < updateData.updateData.time[0][i].length; j++) {
        const time = updateData.updateData.time[0][i][j];
        console.log(
          updateData.updateData.time[0][i] +
            "====>>  updateData.updateData.time[i][j]",
        );
        const existence = await this.createQueryBuilder("time_table")
          .where("time_table.lessonId = :lessonid", {
            lessonid: updateData.lessonId,
          })
          .andWhere("time_table.day = :day", {
            day: day,
          })
          .andWhere("time_table.time = :time", {
            time: time,
          })
          .getOne();

        if (!existence) {
          console.log(time + "====>>  updateData.time[i][j]");
          const createdTimeTale = this.create({
            lessonId: updateData.lessonId,
            day: day,
            time: time,
          });
          await this.save(createdTimeTale);
        }
      }
    }

    //같은요일 같은시간 안들어가게.
  }

  async updateTimetable(updateData, id: number) {
    //param id 로 가져와서
    //  axios.patch("http://localhost:4000/api/time-tables/" + id, {
    //    updateData,
    //  });

    const existTime = await getRepository(TimeTable)
      .createQueryBuilder("time_table")
      .where("time_table.id = :tid", { tid: id })
      .getOne();

    //시간표만 수정
    this.createQueryBuilder()
      .update(TimeTable)
      .set({
        time: updateData.time,
        day: updateData.day,
      })
      .where("id = :id", { id: id })
      .execute();

    return;
  }
}

//ex
// 일월화수금, 시간.
//2022-03-15 10:38:40

// {
//     "day": ["1","2","3","4","6"],
//     "time":[
//             ["08:00:00","10:00:00","11:00:00","12:00:00"],
//             ["08:00:00","10:00:00","18:00:00"],
//             ["08:00:00","10:00:00","13:00:00","15:00:00"],
//             ["08:00:00","10:00:00","13:00:00","14:00:00"],
//             ["08:00:00","10:00:00","13:00:00"]
//     ]

// }
