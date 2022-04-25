import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { TeacherDecorator } from "src/decorators/teacher.decorator";
import { TimeTablesService } from "./time-tables.service";

@Controller("api/time-tables")
export class TimeTablesController {
  constructor(private timeTablesService: TimeTablesService) {}

  // @UseGuards(AuthGuard("jwt"))
  @Post()
  async createTimeTable(
    @Body() updateData,
    // @TeacherDecorator() isTeacher: boolean,
  ) {
    console.log("create입니다");
    return this.timeTablesService.createTimeTable(updateData);
  }

  // @UseGuards(AuthGuard("jwt"))
  @Patch("/:id")
  async updateTimetable(
    @Body() updateData,
    @Param("id") id: number,
    // @TeacherDecorator() isTeacher: boolean,
  ) {
    return this.timeTablesService.updateTimetable(updateData, id);
  }
  //시간표 수정 업데이트
}
