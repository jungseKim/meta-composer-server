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
}
