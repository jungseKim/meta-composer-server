import {Signup} from 'src/entities/signup.entity';
import {User} from 'src/entities/user.entity';
import {EntityRepository, getRepository, Repository} from 'typeorm';
@EntityRepository(Signup)
export class SignupsRepository extends Repository<Signup> {
    async signup(id : number, merchant_uid, user : User): Promise<Signup> {

        console.log(id,merchant_uid,user);
        const signup = this.create({merchant_uid, lessonId: id, userId: user.id});

        const existence = 
        await this.createQueryBuilder("signup")
        .where("signup.lessonId = :lessonid",{lessonid:id})
        .andWhere("signup.userId = :userid",{userid:user.id}).getOne();
        // .andWhere("signup.merchant_uid =:mid",{mid:merchant_uid})
        if(!existence){
        await this.save(signup);

        return signup;
        }else{
           console.log("already exist lesson and userid");
        }
      
    }
}
// merchant_uid & lessonId & userId =>x
// merchant_uid & lessonId  userId =>x