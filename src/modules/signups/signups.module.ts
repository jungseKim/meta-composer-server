import { TasksModule } from "./../tasks/tasks.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SignupsController } from "./signups.controller";
import { SignupsRepository } from "./signups.repository";
import { SignupsService } from "./signups.service";
import { SignupDayAndTimesModule } from "../signup-day-and-times/signup-day-and-times.module";
import { Repository } from "typeorm";
import { Signup } from "src/entities/signup.entity";
import { TimeTablesModule } from "../time-tables/time-tables.module";
import { SignupTimetablesModule } from "../signup-timetables/signup-timetables.module";
import { NotificationModule } from "src/gateways/notification/notification.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([SignupsRepository]),
    TasksModule,
    SignupDayAndTimesModule,
    SignupTimetablesModule,
    NotificationModule,
  ],
  providers: [SignupsService],
  controllers: [SignupsController],
  exports: [SignupsService],
})
export class SignupsModule {} //asd
