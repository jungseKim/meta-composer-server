import {
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
import { UserDecorator } from "src/decorators/user.decorator";
import { User } from "src/entities/user.entity";
import { Wishlist } from "src/entities/wishlist.entity";
import { WishlistsService } from "./wishlists.service";

@Controller("api/wishlists")
@ApiTags("WISH List API")
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post(":lid")
  @ApiOperation({
    summary: "WishList 등록",
    description:
      "WishList를 등록한다, lid는 레슨의 번호. 한사람이 같은 레슨은 한번만 WishList에 추가가능하다",
  })
  @ApiResponse({
    status: 200,
    description: "WishList 등록완료",
    type: Wishlist,
  })
  @ApiBody({ type: Wishlist })
  @UseInterceptors(TransformResponseInterceptor)
  createWishList(@UserDecorator() user: User, @Param("lid") lid: number) {
    return this.wishlistsService.createWishList(user, lid);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":lid")
  @ApiOperation({
    summary: "WishList 삭제",
    description:
      "WishList를 삭제한다, lid는 레슨의 번호. 한사람이 같은 레슨은 한번만 WishList에 추가가능하다",
  })
  @ApiResponse({
    status: 200,
    description: "WishList 삭제완료",
    type: Wishlist,
  })
  @UseInterceptors(TransformResponseInterceptor)
  deleteWishList(@UserDecorator() user: User, @Param("lid") lid: number) {
    return this.wishlistsService.deleteWishList(user, lid);
  }
}
