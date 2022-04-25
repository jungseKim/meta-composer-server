import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
}
