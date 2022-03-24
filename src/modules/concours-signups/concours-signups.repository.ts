import { ConcoursSignup } from "src/entities/concoursSignup.entity";

import { EntityRepository, Repository } from "typeorm";

@EntityRepository(ConcoursSignup)
export class ConcoursSignupsRepository extends Repository<ConcoursSignup> {
  async participate(updateData, user): Promise<ConcoursSignup> {
    const existence = await this.createQueryBuilder("concours_signup")
      .where("concoursId = :concoursId", {
        concoursId: updateData.concoursId,
      })
      .andWhere("userId = :userid", { userid: user.id })
      .getOne();

    console.log(existence);
    if (!existence) {
      const signup = this.create({
        youtubeURL: updateData.youtubeURL,
        concoursId: updateData.concoursId,
        merchant_uid: updateData.merchant_uid,
        participated_date: updateData.participated_date,
        userId: user.id,
      });
      await this.save(signup);
      return signup;
    }

    return;
  }
}
