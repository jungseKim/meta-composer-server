import { PickType } from "@nestjs/swagger";
import { Teacher } from "src/entities/teacher.entity";
import { TimeTable } from "src/entities/timeTable.entity";

export class TimeTableDto extends PickType(TimeTable, [
  "signupId",
  "day",
  "time",
  "lessonId",
] as const) {}
