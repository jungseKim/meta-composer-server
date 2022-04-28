import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { TeacherDecorator } from "src/decorators/teacher.decorator";
import { TimeTable } from "src/entities/timeTable.entity";
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

  @ApiOperation({
    summary: "WishList 등록",
    description:
      "레슨 수강등록전에 빈시간이 있는지 확인하는api. TimeTable 조회 한다. query로 lessonId를 날려주세요(INT). ",
  })
  @ApiResponse({
    status: 200,
    description: "TimeTable 조회완료",
    type: TimeTable,
  })
  @Get()
  async viewTimeTable(@Query("lessonId", ParseIntPipe) lessonId: number) {
    return this.timeTablesService.viewTimeTable(lessonId);
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
