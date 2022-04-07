import { Part } from "src/entities/part.entity";
import { Payment } from "src/entities/payment.entity";
import { Signup } from "src/entities/signup.entity";

import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Part)
export class PartsRepository extends Repository<Part> {
  async createPart(): Promise<Part[]> {
    return;
  }
}
