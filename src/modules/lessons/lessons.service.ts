import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Lesson } from "src/entities/lesson.entity";
import { SearchHistory } from "src/entities/searchHistory.entiry";
import { User } from "src/entities/user.entity";
import { ViewCount } from "src/entities/viewCount.entity";
import { Repository } from "typeorm";
import { SearchHistoriesService } from "../search-histories/search-histories.service";
import { ViewcountsService } from "../viewcounts/viewcounts.service";
import { LessonsRepository } from "./lessons.repository";

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(LessonsRepository)
    private lessonsRepository: LessonsRepository,
    @InjectRepository(SearchHistory)
    private searchHistoriesRepository: Repository<SearchHistory>,

    private viewcountsService: ViewcountsService, //
  ) {}

  async showAllLesson(page: number, perPage: number): Promise<Lesson[]> {
    return this.lessonsRepository
      .createQueryBuilder("lesson")
      .leftJoinAndSelect("lesson.teacher", "teacher")
      .leftJoinAndSelect("teacher.user", "user")
      .orderBy("lesson.id", "DESC")
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
    //findAll
  }

  async createLesson(updateData, user: User, image: any): Promise<Lesson> {
    return this.lessonsRepository.createLesson(updateData, user, image);
  }

  async getLessonById(user: User, id: number): Promise<any> {
    const lesson = await this.lessonsRepository
      .createQueryBuilder("lesson")
      .where("lesson.id = :id", { id: id })
      .leftJoinAndSelect("lesson.timeTables", "timeTables")
      .leftJoinAndSelect("lesson.comments", "comments")
      .leftJoinAndSelect("lesson.chatRooms", "chatRooms")
      .leftJoinAndSelect("lesson.wishlists", "wishlists")
      .leftJoinAndSelect("lesson.sheets", "sheets")
      .leftJoinAndSelect("lesson.teacher", "teacher")
      .leftJoinAndSelect("teacher.user", "user")
      // .leftJoinAndSelect("lesson.sheets", "signups");
      .getOne();

    // await axios.post("http://localhost:4000/api/viewcounts", {
    //   user,
    //   id,
    // });

    this.viewcountsService.counting({ user, id });
    //join 댓글, 악보 등등
    if (!lesson) {
      throw new NotFoundException(`can't find lesson id ${id}`);
    }
    return lesson;
  }

  async deleteLessonById(id: number): Promise<void> {
    await this.lessonsRepository.delete(id);
  }
  async updateLessonById(id: number, updateData, user: User): Promise<void> {
    await this.lessonsRepository.updateLessonById(id, updateData, user);
  }

  async searchLesson(
    searchKeyword: string,
    user: User,
    page: number,
    perPage: number,
  ): Promise<Lesson[]> {
    const result = await this.lessonsRepository
      .createQueryBuilder("lesson")

      .where("lesson.introduce LIKE (:searchKeyword)", {
        searchKeyword: `%${searchKeyword}%`,
      })
      .orWhere("lesson.name LIKE (:searchKeyword)", {
        searchKeyword: `%${searchKeyword}%`,
      })
      .orWhere("lesson.type LIKE (:searchKeyword)", {
        searchKeyword: `%${searchKeyword}%`,
      })
      .leftJoinAndSelect("lesson.teacher", "teacher")
      .leftJoinAndSelect("teacher.user", "user")
      .orderBy("lesson.id", "DESC")
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();

    const ArrayOFresult = [];
    result.forEach((x) => {
      console.log(x.id);
      ArrayOFresult.push(x.id);

      this.searchHistoriesRepository
        .createQueryBuilder()
        .insert()
        .into(SearchHistory)
        .values([
          {
            userId: user.id,
            searchString: searchKeyword,
            lessonId: x.id,
          },
        ])
        .execute();
    });
    console.log(ArrayOFresult);

    return this.lessonsRepository.searchLesson(
      searchKeyword,
      user,
      page,
      perPage,
    );
  }
  async searchLessonbyType(
    searchKeyword: string,
    user: User,
    page: number,
    perPage: number,
  ): Promise<Lesson[]> {
    return this.lessonsRepository.searchLessonbyType(
      searchKeyword,
      user,
      page,
      perPage,
    );
  }
}
