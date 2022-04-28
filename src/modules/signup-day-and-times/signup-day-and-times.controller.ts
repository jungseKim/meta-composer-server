import { Controller } from "@nestjs/common";
import { SignupDayAndTimesService } from "./signup-day-and-times.service";

@Controller("signup-day-and-times")
export class SignupDayAndTimesController {
  constructor(private signupDayAndTimesService: SignupDayAndTimesService) {}
}
