import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Signup } from "src/entities/signup.entity";
import { User } from "src/entities/user.entity";
import { TasksService } from "../tasks/tasks.service";
import { SignupsRepository } from "./signups.repository";

@Injectable()
export class SignupsService {
  constructor(
    @InjectRepository(SignupsRepository)
    private signupsRepository: SignupsRepository,
    private tasksService: TasksService, //
  ) {}

  async signup(id, updateData, user: User): Promise<Signup> {
    const signup = await this.signupsRepository.signupTest(
      id,
      updateData,
      user,
    );
    await this.tasksService.signupNotificationTest(signup);
    // return this.signupsRepository.signup(id, updateData, user);
    return signup;
  }
}
