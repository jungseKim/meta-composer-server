import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Signup } from "src/entities/signup.entity";
import { User } from "src/entities/user.entity";
import { SignupsRepository } from "./signups.repository";
import axios, { AxiosResponse } from "axios";

@Injectable()
export class SignupsService {
  constructor(
    @InjectRepository(SignupsRepository)
    private signupsRepository: SignupsRepository, //
  ) {}

  async signup(id, updateData, user: User): Promise<Signup> {
    axios.post("http://localhost:4000/api/signup-timetables", {
      updateData: {
        startdate: updateData.startdate,
        finishdate: updateData.finishdate,
        lessonTime: updateData.lessonTime,
        weekdays: updateData.weekdays,
      },
    });

    return this.signupsRepository.signup(id, updateData, user);
  }
}
