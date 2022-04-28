import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Signup } from "src/entities/signup.entity";
import { SignupDayAndTime } from "src/entities/signupDayAndTime.entity";
import { Repository } from "typeorm";
import { SignupsModule } from "../signups/signups.module";
import { SignupDayAndTimesController } from "./signup-day-and-times.controller";
import { SignupDayAndTimesService } from "./signup-day-and-times.service";

@Module({
  imports: [TypeOrmModule.forFeature([SignupDayAndTime])],
  controllers: [SignupDayAndTimesController],
  providers: [SignupDayAndTimesService],
  exports: [SignupDayAndTimesService],
})
export class SignupDayAndTimesModule {}
