import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from 'src/entities/wishlist.entity';
import { WishlistsRepository } from './wishlists.repository';

@Injectable()
export class WishlistsService {
    constructor(
        @InjectRepository(WishlistsRepository) private wishlistsRepository : WishlistsRepository,
        //
    ) {}
    async createWishList(user,lid) : Promise<any>{
        return this.wishlistsRepository.createWishList(user,lid)

    }

    async deleteWishList(user,lid) : Promise<void>{
        return this.wishlistsRepository.deleteWishList(user,lid)

    }

}
