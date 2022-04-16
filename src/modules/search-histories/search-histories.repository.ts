import { SearchHistory } from "src/entities/searchHistory.entiry";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(SearchHistory)
export class SearchHistoriesRepository extends Repository<SearchHistory> {
  async saveSearchHistory(): Promise<SearchHistory[]> {
    return;
  }
}
