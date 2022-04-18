import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SearchHistory } from "src/entities/searchHistory.entiry";
import { SearchHistoriesRepository } from "./search-histories.repository";

@Injectable()
export class SearchHistoriesService {
  constructor(
    @InjectRepository(SearchHistoriesRepository)
    private searchHistoriesRepository: SearchHistoriesRepository, //
  ) {}

  // async saveSearchHistory(): Promise<SearchHistory[]> {
  //   return this.searchHistoriesRepository.saveSearchHistory();
  // }
}
