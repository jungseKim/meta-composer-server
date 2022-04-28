import { PickType } from "@nestjs/swagger";
import { time } from "console";
import { Signup } from "src/entities/signup.entity";
import { SignupDayAndTime } from "src/entities/signupDayAndTime.entity";
import { Signuptimetable } from "src/entities/signuptimetable.entity";

export class SignupDayAndTimeDto extends PickType(SignupDayAndTime, [
  "weekdays",
  "lessonTime",
  "signup",
] as const) {}
