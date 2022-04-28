import { User } from "src/entities/user.entity";
import { Wishlist } from "src/entities/wishlist.entity";
import { EntityRepository, Repository } from "typeorm";
import { WishListDto } from "./dto/wishlist.dto";

@EntityRepository(Wishlist)
export class WishlistsRepository extends Repository<Wishlist> {
  async createWishList(user: User, lid: number): Promise<any> {
    const existence: WishListDto = await this.createQueryBuilder("wishlist")
      .where("wishlist.userId = :userid", { userid: user.id })
      .andWhere("wishlist.lessonId = :lessonid", { lessonid: lid })
      .getOne();

    if (!existence) {
      const wishlist: WishListDto = this.create({
        userId: user.id,
        lessonId: lid,
      });

      return this.save(wishlist);
    } else {
      return "already exists on your wishlist";
    }
  }

  async deleteWishList(user: User, lid: number): Promise<void> {
    const existence = await this.createQueryBuilder("wishlist")
      .where("wishlist.userId = :userid", { userid: user.id })
      .andWhere("wishlist.lessonId = :lessonid", { lessonid: lid })
      .getOne();

    if (existence) {
      await this.delete(existence);
      console.log("completely deleted");
    } else console.log("you haven't written wishlist yet");
    ////
  }

  async getWishList(
    user: User,
    page: number,
    perPage: number,
  ): Promise<Wishlist[]> {
    return await this.createQueryBuilder("wishlist")
      .where("wishlist.userId = :userid", { userid: user.id })
      .innerJoinAndSelect("wishlist.lesson", "lesson")
      .leftJoinAndSelect("lesson.comments", "comment")
      .leftJoinAndSelect("lesson.teacher", "teacher")
      .leftJoinAndSelect("teacher.user", "user")
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
  }
}
