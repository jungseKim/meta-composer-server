import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Signup } from "src/entities/signup.entity";
import { Signuptimetable } from "src/entities/signuptimetable.entity";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { SignuptimetablesRepository } from "./signup-timetables.repository";

@Injectable()
export class SignupTimetablesService {
  constructor(
    @InjectRepository(SignuptimetablesRepository)
    private signuptimetablesRepository: SignuptimetablesRepository,
    @InjectRepository(Signup)
    private signupRepository: Repository<Signup>,
  ) {}

  async createTimeTable(updateData) {
    return this.signuptimetablesRepository.createTimeTable(updateData);
  }
  async getMyTimeTable(user: User): Promise<Signup[]> {
    return await this.signupRepository
      .createQueryBuilder("signup")
      .leftJoinAndSelect("signup.signuptimetables", "signuptimetables")
      .innerJoinAndSelect("signup.lesson", "lesson")
      .where("signup.userId = :userId", { userId: user.id })
      .getMany();

    // return this.signuptimetablesRepository.getMyTimeTable(user);
  }
}
