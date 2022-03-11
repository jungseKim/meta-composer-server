import {Wishlist} from "src/entities/wishlist.entity";
import {EntityRepository, Repository} from "typeorm";
import { WishListDto } from "./dto/wishlist.dto";

@EntityRepository(Wishlist)
export class WishlistsRepository extends Repository<Wishlist> {

    async createWishList(user, lid): Promise<any> {

        const existence :WishListDto = await this
            .createQueryBuilder('wishlist')
            .where('wishlist.userId = :userid', {userid: user.id})
            .andWhere('wishlist.lessonId = :lessonid', {lessonid: lid})
            .getOne();

        if (!existence) {
            const wishlist :WishListDto = this.create({userId: user.id, lessonId: lid})

            return this.save(wishlist)
        } else {
            return "already exists on your wishlist";
        }

    }

    async deleteWishList(user,lid) : Promise<void>{

        
        const existence =  await this
        .createQueryBuilder('wishlist')
        .where('wishlist.userId = :userid', {userid: user.id})
        .andWhere('wishlist.lessonId = :lessonid', {lessonid: lid})
        .getOne();

        if(existence){
        this.delete(existence);
        console.log("completely deleted");
        }else
        console.log("you had not wrote wishlist");
        ////
    }   


}