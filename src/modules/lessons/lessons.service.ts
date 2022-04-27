import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { throws } from "assert";
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
    // @InjectRepository(Comment)
    // private commentsRepository: Repository<Comment>,
    private viewcountsService: ViewcountsService, //
  ) {}

  async showAllLesson(
    page: number,
    perPage: number,
    order: string[],
  ): Promise<Lesson[]> {
    const lessons = await this.lessonsRepository
      .createQueryBuilder("lesson")
      .leftJoinAndSelect("lesson.teacher", "teacher")
      .leftJoinAndSelect("teacher.user", "user")
      .leftJoinAndSelect("lesson.comments", "comment")
      .addSelect(order[0])
      .orderBy(order[1], "DESC")
      .groupBy("lesson.id")
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();

    //AndSelect빼니까 안되는 오류있음
    // const lessons = await this.lessonsRepository
    //   .createQueryBuilder("lesson")
    //   .leftJoinAndSelect("lesson.teacher", "teacher")
    //   .leftJoinAndSelect("teacher.user", "user")
    //   .leftJoinAndSelect("lesson.comments", "comment")
    //   .addSelect("AVG(comment.rating) AS count")
    //   .orderBy("count", "DESC")
    //   .groupBy("lesson.id")
    //   .take(perPage)
    //   .skip(perPage * (page - 1))
    //   .getMany();

    return lessons;
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
      .leftJoinAndSelect("comments.user", "users")
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
    order: string[],
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
      order,
    );
  }
  async searchLessonbyType(
    searchKeyword: string,
    user: User,
    page: number,
    perPage: number,
    order: string[],
  ): Promise<Lesson[]> {
    return this.lessonsRepository.searchLessonbyType(
      searchKeyword,
      user,
      page,
      perPage,
      order,
    );
  }
}
