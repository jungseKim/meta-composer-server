import { SearchHistory } from "src/entities/searchHistory.entiry";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(SearchHistory)
export class SearchHistoriesRepository extends Repository<SearchHistory> {
  async saveSearchHistory(user, id, searchKeyword): Promise<SearchHistory[]> {
    await this.createQueryBuilder()
      .insert()
      .into(SearchHistory)
      .values([
        {
          userId: user.id,
          searchString: searchKeyword,
          lessonId: id,
        },
      ])
      .execute();
    return;
  }
}
