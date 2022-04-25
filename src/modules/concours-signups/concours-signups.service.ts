import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConcoursSignup } from "src/entities/concoursSignup.entity";
import { User } from "src/entities/user.entity";
import { ConcoursSignupsRepository } from "./concours-signups.repository";

@Injectable()
export class ConcoursSignupsService {
  constructor(
    @InjectRepository(ConcoursSignupsRepository)
    private concoursSignupsRepository: ConcoursSignupsRepository, //
  ) {}

  async participate(updateData: ConcoursSignup, user: User, id: number) {
    return this.concoursSignupsRepository.participate(updateData, user, id);
  }

  async check(user: User, id: number) {
    return this.concoursSignupsRepository.check(user, id);
  }
}
