import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TimeTable } from "src/entities/timeTable.entity";
import { getRepository } from "typeorm";
import { TimeTablesRepository } from "./time-tables.repository";

@Injectable()
export class TimeTablesService {
  constructor(
    @InjectRepository(TimeTablesRepository)
    private timeTablesRepository: TimeTablesRepository, //
  ) {}

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
        const existence = await this.timeTablesRepository
          .createQueryBuilder("time_table")
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
          const createdTimeTale = this.timeTablesRepository.create({
            lessonId: updateData.lessonId,
            day: day,
            time: time,
          });
          await this.timeTablesRepository.save(createdTimeTale);
        }
      }
    }

    //같은요일 같은시간 안들어가게.

    // return this.timeTablesRepository.createTimeTable(updateData);
  }
  async updateTimetable(updateData, id: number) {
    return this.timeTablesRepository.updateTimetable(updateData, id);
  }
  async viewTimeTable(_lessonId: number) {
    return await getRepository(TimeTable)
      .createQueryBuilder("time_table")
      .where("time_table.lessonId = :lid", { lid: _lessonId })
      .leftJoinAndSelect("time_table.lesson", "lesson")
      .getMany();
  }
}
