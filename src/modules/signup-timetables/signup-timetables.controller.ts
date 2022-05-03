import {
  Body,
  ConsoleLogger,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
import { UserDecorator } from "src/decorators/user.decorator";
import { Signup } from "src/entities/signup.entity";
import { Signuptimetable } from "src/entities/signuptimetable.entity";
import { User } from "src/entities/user.entity";
import { SignupsRepository } from "../signups/signups.repository";
import { SignupTimetablesService } from "./signup-timetables.service";

@Controller("api/signup-timetables")
@ApiTags("수강 시간표 API")
export class SignupTimetablesController {
  constructor(private signupTimetablesService: SignupTimetablesService) {}

  @Post()
  async createTimeTable(@Body() updateData) {
    console.log(updateData);
    this.signupTimetablesService.createTimeTable(updateData);
  }

  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(TransformResponseInterceptor)
  @Get()
  async getMyTimeTable(@UserDecorator() user: User): Promise<Signup[]> {
    return this.signupTimetablesService.getMyTimeTable(user);
  }
}
