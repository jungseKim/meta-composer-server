import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistsController } from '../wishlists/wishlists.controller';
import { WishlistsRepository } from '../wishlists/wishlists.repository';
import { WishlistsService } from '../wishlists/wishlists.service';

@Module({
  imports:[TypeOrmModule.forFeature([WishlistsRepository])],
  controllers: [WishlistsController],
  providers: [WishlistsService]
})
export class WishlistsModule {}
