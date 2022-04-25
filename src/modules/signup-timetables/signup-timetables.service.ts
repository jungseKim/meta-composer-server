import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Signuptimetable } from "src/entities/signuptimetable.entity";
import { User } from "src/entities/user.entity";
import { SignuptimetablesRepository } from "./signup-timetables.repository";

@Injectable()
export class SignupTimetablesService {
  constructor(
    @InjectRepository(SignuptimetablesRepository)
    private signuptimetablesRepository: SignuptimetablesRepository, //
  ) {}

  async createTimeTable(updateData) {
    return this.signuptimetablesRepository.createTimeTable(updateData);
  }
  async getMyTimeTable(user: User): Promise<Signuptimetable[]> {
    return this.signuptimetablesRepository.getMyTimeTable(user);
  }
}
