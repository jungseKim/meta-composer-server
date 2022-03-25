import { Body, Controller, Post } from "@nestjs/common";
import { TimeTablesService } from "./time-tables.service";

@Controller("api/time-tables")
export class TimeTablesController {
  constructor(private timeTablesService: TimeTablesService) {}

  @Post()
  async createTimeTable(@Body() updateData) {
    console.log("create입니다");
    return this.timeTablesService.createTimeTable(updateData);
  }
}
