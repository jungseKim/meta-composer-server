import { UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Lesson, LessonType } from "src/entities/lesson.entity";
import { Teacher } from "src/entities/teacher.entity";
import { EntityRepository, getRepository, Repository } from "typeorm";
import axios, { AxiosResponse } from "axios";
import { TimeTable } from "src/entities/timeTable.entity";
import { SearchHistoriesRepository } from "../search-histories/search-histories.repository";
import { SearchHistory } from "src/entities/searchHistory.entiry";
import { SearchHistoriesService } from "../search-histories/search-histories.service";
import { User } from "src/entities/user.entity";
@EntityRepository(Lesson)
export class LessonsRepository extends Repository<Lesson> {
  // const teacherId = Repository<Teacher>.find(user.id);

  // async createLesson(updateData, user: User, image: any): Promise<any> {}

  async updateLessonById(
    id: number,
    updateData: Lesson,
    user: User,
  ): Promise<any> {
    this.createQueryBuilder()
      .update(Lesson)
      .set({
        introduce: updateData.introduce,
        length: updateData.length,
        price: updateData.price,
        name: updateData.name,
        type: updateData.type,
      })
      .where("id = :id", { id: id })
      .execute();

    return;
  }

  async searchLesson(
    searchKeyword: string,
    user: User,
    page: number,
    perPage: number,
  ): Promise<Lesson[]> {
    const result = await this.createQueryBuilder("lesson")

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
    });
    console.log(ArrayOFresult);
    ////////////////////

    //////////////this makes error
    return result;
    //엔티티, 모듈, tensorflow 에 보내기
  }
  async searchLessonbyType(
    searchKeyword: string,
    user: User,
    page: number,
    perPage: number,
  ): Promise<Lesson[]> {
    const result = await this.createQueryBuilder("lesson")
      .where("lesson.type = :searchKeyword", {
        searchKeyword: searchKeyword,
      })
      .orderBy("lesson.id", "DESC")
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();

    return result;
    //엔티티, 모듈, tensorflow 에 보내기
  }
}
