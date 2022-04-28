import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Signup } from "src/entities/signup.entity";
import { User } from "src/entities/user.entity";
import { SignupDayAndTimesService } from "../signup-day-and-times/signup-day-and-times.service";
import { TasksService } from "../tasks/tasks.service";
import { SignupsRepository } from "./signups.repository";

@Injectable()
export class SignupsService {
  constructor(
    @InjectRepository(SignupsRepository)
    private signupsRepository: SignupsRepository,
    private tasksService: TasksService,
    private signupDayAndTimesService: SignupDayAndTimesService, //
  ) {}

  async signup(id, updateData, user: User): Promise<any> {
    console.log(updateData);
    console.log("왜안나와?");
    const dayData = updateData.weekdays;
    const timeData = updateData.lessonTime;

    const signup: Signup = await this.signupsRepository.signup(
      id,
      updateData,
      user,
    );

    this.signupDayAndTimesService.saveDayAndTimes(dayData, timeData, id, user);
    // await this.tasksService.signupNotificationTest(signup);
    return signup;
  }
  // async signup(id: number, updateData, user: User): Promise<Signup> {
  //   const signup = await this.signupsRepository.signupTest(
  //     id,
  //     updateData,
  //     user,
  //   );
  //   await this.tasksService.signupNotificationTest(signup);
  //   // return this.signupsRepository.signup(id, updateData, user);
  //   return signup;
  // }
}
