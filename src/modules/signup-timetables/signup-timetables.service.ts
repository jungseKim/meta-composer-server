import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SignuptimetablesRepository } from "./signup-timetables.repository";

@Injectable()
export class SignupTimetablesService {
  constructor(
    @InjectRepository(SignuptimetablesRepository)
    private signuptimetablesRepository: SignuptimetablesRepository, //
  ) {}
}
