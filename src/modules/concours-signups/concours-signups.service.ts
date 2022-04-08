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

  async participate(updateData, user, id) {
    return this.concoursSignupsRepository.participate(updateData, user, id);
  }

  async check(user, id) {
    return this.concoursSignupsRepository.check(user, id);
  }
}
