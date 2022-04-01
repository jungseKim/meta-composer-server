import { PickType } from "@nestjs/swagger";
import { time } from "console";
import { Signup } from "src/entities/signup.entity";
import { Signuptimetable } from "src/entities/signuptimetable.entity";

export class SignupTimetableDto extends PickType(Signuptimetable, [
  "time",
  "signupId",
  "Isparticipate",
] as const) {}
