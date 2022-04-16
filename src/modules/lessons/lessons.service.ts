import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Lesson } from "src/entities/lesson.entity";
import { LessonsRepository } from "./lessons.repository";

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(LessonsRepository)
    private lessonsRepository: LessonsRepository, //
  ) {}

  async showAllLesson(page, perPage): Promise<Lesson[]> {
    return this.lessonsRepository
      .createQueryBuilder("lesson")
      .leftJoinAndSelect("lesson.teacher", "teacher")
      .orderBy("lesson.id", "DESC")
      .take(perPage)
      .skip(perPage * (page - 1))
      .getMany();
    //findAll
  }

  async createLesson(updateData, user, image): Promise<Lesson> {
    return this.lessonsRepository.createLesson(updateData, user, image);
  }

  async getLessonById(id: number): Promise<any> {
    const lesson = await this.lessonsRepository
      .createQueryBuilder("lesson")
      .where("lesson.id = :id", { id: id })
      .leftJoinAndSelect("lesson.timeTables", "timeTables")
      .leftJoinAndSelect("lesson.comments", "comments")
      .leftJoinAndSelect("lesson.chatRooms", "chatRooms")
      .leftJoinAndSelect("lesson.wishlists", "wishlists")
      .leftJoinAndSelect("lesson.sheets", "sheets")
      .leftJoinAndSelect("lesson.teacher", "teacher")
      // .leftJoinAndSelect("lesson.sheets", "signups");
      .getMany();

    //join 댓글, 악보 등등
    if (!lesson) {
      throw new NotFoundException(`can't find lesson id ${id}`);
    }
    return lesson;
  }

  async deleteLessonById(id: number): Promise<void> {
    await this.lessonsRepository.delete(id);
  }
  async updateLessonById(id: number, updateData, user): Promise<void> {
    await this.lessonsRepository.updateLessonById(id, updateData, user);
  }

  async searchLesson(searchKeyword, user, page, perPage): Promise<Lesson[]> {
    return this.lessonsRepository.searchLesson(
      searchKeyword,
      user,
      page,
      perPage,
    );
  }
  async searchLessonbyType(
    searchKeyword,
    user,
    page,
    perPage,
  ): Promise<Lesson[]> {
    return this.lessonsRepository.searchLessonbyType(
      searchKeyword,
      user,
      page,
      perPage,
    );
  }
}
