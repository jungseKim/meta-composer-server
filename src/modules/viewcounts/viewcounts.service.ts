import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { ViewCount } from "src/entities/viewCount.entity";
import { ViewcountsRepository } from "./viewcounts.repository";

@Injectable()
export class ViewcountsService {
  constructor(
    @InjectRepository(ViewcountsRepository)
    private viewcountsRepository: ViewcountsRepository,
  ) {}

  async counting(updateData): Promise<ViewCount> {
    return this.viewcountsRepository.counting(updateData);
  }

  async myViewHistory(user: User): Promise<any> {
    return this.viewcountsRepository.myViewHistory(user);
  }
}
