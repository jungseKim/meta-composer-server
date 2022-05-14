import { PickType } from "@nestjs/swagger";
import { Wishlist } from "src/entities/wishlist.entity";

export class WishListDto extends PickType(Wishlist, [
  "userId",
  "lessonId",
] as const) {}
