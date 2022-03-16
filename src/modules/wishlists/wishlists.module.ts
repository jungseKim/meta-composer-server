import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WishlistsController } from "./wishlists.controller";
import { WishlistsRepository } from "./wishlists.repository";
import { WishlistsService } from "./wishlists.service";

@Module({
  imports: [TypeOrmModule.forFeature([WishlistsRepository])],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
