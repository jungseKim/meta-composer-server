
import { ConcoursSignup } from "src/entities/concoursSignup.entity";

import { EntityRepository, Repository } from "typeorm";

@EntityRepository(ConcoursSignup)
export class ConcoursSignupsRepository extends Repository<ConcoursSignup>{

    async participate(updateData,user): Promise<ConcoursSignup>{

        const signup = this.create({
           youtubeURL: updateData.youtubeURL,
           concoursId: updateData.concoursId,
           merchant_uid: updateData.merchant_uid,
           participated_date: updateData.participated_date,
           userId : user.id
        });

        await this.save(signup);
        return;
    }

}