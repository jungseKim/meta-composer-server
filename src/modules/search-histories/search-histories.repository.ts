import { Lesson } from "src/entities/lesson.entity";
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

  async mySearchHistory(user: User): Promise<any> {
    const mySearchHistory = await this.createQueryBuilder("search_history")
      .where("search_history.userId = :userId", {
        userId: user.id,
      })
      .leftJoinAndSelect("search_history.lesson", "lesson")
      .getMany();

    const typesList = [];

    for (const types in mySearchHistory) {
      // console.log(mySearchHistory[types].lesson.type);
      typesList.push(mySearchHistory[types].lesson.type);
    }
    // console.log(typesList);
    // console.log(mySearchHistory);
    return typesList;
  }
}
