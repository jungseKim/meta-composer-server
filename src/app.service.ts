import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Signup } from "./entities/signup.entity";
import { SignupsRepository } from "./modules/signups/signups.repository";
import { TasksService } from "./modules/tasks/tasks.service";
@Injectable()
export class AppService {
  constructor() {}
  getHello(): string {
    return "11";
  }

  public async test() {}
}
