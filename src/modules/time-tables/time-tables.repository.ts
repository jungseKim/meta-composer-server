import { EntityRepository, getRepository, Repository } from "typeorm";

import { TimeTable } from "src/entities/timeTable.entity";
import { ConsoleLogger } from "@nestjs/common";

@EntityRepository(TimeTable)
export class TimeTablesRepository extends Repository<TimeTable> {
  // async createTimeTable(updateData) {

  // }

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
