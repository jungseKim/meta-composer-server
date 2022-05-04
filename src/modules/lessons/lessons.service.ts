import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Lesson } from "src/entities/lesson.entity";
import { SearchHistory } from "src/entities/searchHistory.entiry";
import { User } from "src/entities/user.entity";
import { ViewCount } from "src/entities/viewCount.entity";
import { getRepository, Repository } from "typeorm";
import { SearchHistoriesService } from "../search-histories/search-histories.service";
import { ViewcountsService } from "../viewcounts/viewcounts.service";
import { LessonsRepository } from "./lessons.repository";
import { Connection } from "typeorm";
import axios, { AxiosResponse } from "axios";
import { Teacher } from "src/entities/teacher.entity";
import { TimeTablesService } from "../time-tables/time-tables.service";

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(LessonsRepository)
    private lessonsRepository: LessonsRepository,
    @InjectRepository(SearchHistory)
    private searchHistoriesRepository: Repository<SearchHistory>,

    private viewcountsService: ViewcountsService,
    private timetablesService: TimeTablesService, //
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
    const checkTeacher = await getRepository(Teacher)
      .createQueryBuilder("teacher")
      .where("teacher.userId = :id", { id: user.id })
      .getOne();

    updateData.time = JSON.parse(
      "[" + updateData.time.replace(/'/g, '"') + "]",
    );
    console.log(updateData.day);
    updateData.day = JSON.parse("[" + updateData.day.replace(/'/g, '"') + "]");

    console.log(updateData.day);

    console.log(updateData.time);

    const lesson = this.lessonsRepository.create({
      introduce: updateData.introduce,

      imageURL: image.filename,
      length: updateData.length,
      price: +updateData.price,
      name: updateData.name,
      type: updateData.type,
      teacherId: checkTeacher.id,
      checkPlease: updateData.checkPlease,
      weLearnThis: updateData.weLearnThis,
      difficulty: updateData.difficulty,
    });

    await this.lessonsRepository.save(lesson);

    this.timetablesService.createTimeTable({
      updateData,
      lessonId: lesson.id,
    });

    return lesson;
    // }
    // else{
    //   return "you are not teacher"
    // }

    // return this.lessonsRepository.createLesson(updateData, user, image);
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
      .getOne();

    // .leftJoinAndSelect("lesson.sheets", "signups");

    // await axios.post("http://localhost:4000/api/viewcounts", {
    //   user,
    //   id,
    // });

    //-----------------------------------------------
    // const ratingAVG = await this.lessonsRepository
    //   .createQueryBuilder("comment")
    //   .select("SUM(comment.rating)", "sum")
    //   .where("comment.lessonId = :lessonId", { lessonId: id })
    //   .getRawOne();

    // console.log(ratingAVG);
    //-----------------------------------------------

    if (user) {
      this.viewcountsService.counting({ user, id });
    }
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
