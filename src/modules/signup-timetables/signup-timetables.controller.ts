import { ConsoleLogger, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SignupsRepository } from "../signups/signups.repository";
import { SignupTimetablesService } from "./signup-timetables.service";

@Controller("api/signup-timetables")
@ApiTags("수강 시간표 API")
export class SignupTimetablesController {
  constructor(
    private signupTimetablesService: SignupTimetablesService,
    private signupsRepository: SignupsRepository,
  ) {}

  @Post()
  async createTimeTable(updateData) {
    this.signupTimetablesService.createTimeTable(updateData);
  }
}
