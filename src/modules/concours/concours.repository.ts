import { Concours } from "src/entities/concours.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Concours)
export class ConcoursRepository extends Repository<Concours> {
  async createConcours(updateData: Concours, image: any): Promise<Concours> {
    const concours = this.create({
      price: updateData.price,
      concoursSignupStartTime: updateData.concoursSignupStartTime,
      concoursSignupFinishTime: updateData.concoursSignupFinishTime,
      startTime: updateData.startTime,
      finishTime: updateData.finishTime,
      title: updateData.title,
      contents: updateData.contents,
      coverIMG_url: image.filename,
      minimum_starting_people: updateData.minimum_starting_people,
    });

    await this.save(concours);
    return concours;
  }

  async updateConcours(
    id: number,
    updateData: Concours,
    image: any,
  ): Promise<void> {
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
        coverIMG_url: image.filename,
      })
      .where("id = :id", { id: id })
      .execute();
  }
}
