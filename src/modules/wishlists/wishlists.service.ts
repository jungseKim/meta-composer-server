import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TimeTable } from "src/entities/timeTable.entity";
import { User } from "src/entities/user.entity";
import { Wishlist } from "src/entities/wishlist.entity";
import { getRepository } from "typeorm";
import { WishlistsRepository } from "./wishlists.repository";

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishlistsRepository)
    private wishlistsRepository: WishlistsRepository, //
  ) {}
  async createWishList(user: User, lid: number): Promise<any> {
    return this.wishlistsRepository.createWishList(user, lid);
  }

  async deleteWishList(user: User, lid: number): Promise<any> {
    const existence = await getRepository(Wishlist)
      .createQueryBuilder("wishlist")
      .where("userId = :userid", { userid: user.id })
      .andWhere("lessonId = :lessonid", { lessonid: lid })
      .getOne();

    //      .createQueryBuilder("time_table")
    //      .where("time_table.id = :tid", { tid: id })
    //      .getOne();

    if (existence) {
      await this.wishlistsRepository.delete(lid);
      console.log("completely deleted");
    } else console.log("you haven't written wishlist yet");
    throw new ForbiddenException();
  }
}
