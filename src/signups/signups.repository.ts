
import { Signup } from 'src/entities/signup.entity';
import { EntityRepository, Repository } from 'typeorm';


@EntityRepository(Signup)
export class SignupsRepository extends Repository<Signup> {
  async signup(id:number,merchant_uid): Promise<Signup> {
  

    const signup = this.create({
     merchant_uid,
     lessonId:id,
    userId:1
    });

    await this.save(signup);
    return signup;
  }
}
//asd