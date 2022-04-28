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
    return this.timeTablesRepository.createTimeTable(updateData);
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
