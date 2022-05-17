import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SearchHistory } from "src/entities/searchHistory.entiry";
import { User } from "src/entities/user.entity";
import { SearchHistoriesRepository } from "./search-histories.repository";

@Injectable()
export class SearchHistoriesService {
  constructor(
    private searchHistoriesRepository: SearchHistoriesRepository, //
  ) {}

  async saveSearchHistory(
    user: User,
    id: number,
    searchKeyword: string,
  ): Promise<void> {
    return this.searchHistoriesRepository.saveSearchHistory(
      user,
      id,
      searchKeyword,
    );
  }

  async mySearchHistory(user: User): Promise<any> {
    return this.searchHistoriesRepository.mySearchHistory(user);
  }
}

//1. 내가참가한 콩쿨목록
//2. 콩쿨 영상데이터가져오는데, 어떤콩쿨에인지??
//3.
