import { ConcoursSignup } from "src/entities/concoursSignup.entity";
import { User } from "src/entities/user.entity";

import { EntityRepository, Repository } from "typeorm";

@EntityRepository(ConcoursSignup)
export class ConcoursSignupsRepository extends Repository<ConcoursSignup> {
  async participate(updateData: ConcoursSignup, user: User, id: number) {
    const existence = await this.createQueryBuilder("concours_signup")
      .where("concours_signup.concoursId = :concoursId", {
        concoursId: id,
      })
      .andWhere("concours_signup.userId = :userid", { userid: user.id })
      .getOne();

    if (!existence) {
      const signup = this.create({
        youtubeURL: "",
        // updateData.youtubeURL
        concoursId: id,
        merchant_uid: updateData.merchant_uid,
        participated_date: updateData.participated_date,
        userId: user.id,
      });
      await this.save(signup);
      return signup;
    }
  }

  async check(user: User, id: number) {
    const existence = await this.createQueryBuilder("concours_signup")
      .where("concours_signup.concoursId = :concoursId", {
        concoursId: id,
      })
      .andWhere("concours_signup.userId = :userid", { userid: user.id })
      .getOne();

    if (existence) {
      console.log("불가능");
      return "결제취소";
    } else {
      console.log("가능");
      return;
    }
  }
}
