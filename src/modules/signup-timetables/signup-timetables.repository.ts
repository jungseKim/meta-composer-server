import { Signuptimetable } from "src/entities/signuptimetable.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Signuptimetable)
export class SignuptimetablesRepository extends Repository<Signuptimetable> {
  async createTimeTable(updateData) {
    const timetable = this.create({});

    timetable.save();
  }
}
