import { Concours } from "src/entities/concours.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Concours)
export class ConcoursRepository extends Repository<Concours> {
  async createConcours(updateData): Promise<Concours> {
    const concours = this.create({
      price: updateData.price,
      concoursSignupStartTime: updateData.concoursSignupStartTime,
      concoursSignupFinishTime: updateData.concoursSignupFinishTime,
      startTime: updateData.startTime,
      finishTime: updateData.finishTime,
      title: updateData.title,
      contents: updateData.contents,
      coverIMG_url: updateData.coverIMG_url,
    });

    await this.save(concours);
    return concours;
  }

  async updateConcours(id, updateData): Promise<void> {
    this.createQueryBuilder()
      .update(Concours)
      .set({
        price: updateData.price,
        concoursSignupStartTime: updateData.concoursSignupStartTime,
        concoursSignupFinishTime: updateData.concoursSignupFinishTime,
        startTime: updateData.startTime,
        finishTime: updateData.finishTime,
        title: updateData.title,
        contents: updateData.contents,
        coverIMG_url: updateData.coverIMG_url,
      })
      .where("id = :id", { id: id })
      .execute();
  }
}