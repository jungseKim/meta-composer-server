import { SearchHistory } from "src/entities/searchHistory.entiry";
import { User } from "src/entities/user.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(SearchHistory)
export class SearchHistoriesRepository extends Repository<SearchHistory> {
  async saveSearchHistory(
    user: User,
    id: number,
    searchKeyword: string,
  ): Promise<void> {
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
  }
}
