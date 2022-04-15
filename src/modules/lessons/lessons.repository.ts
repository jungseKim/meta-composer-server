import { UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Lesson, LessonType } from "src/entities/lesson.entity";
import { Teacher } from "src/entities/teacher.entity";
import { EntityRepository, getRepository, Repository } from "typeorm";
import axios, { AxiosResponse } from "axios";
import { TimeTable } from "src/entities/timeTable.entity";
@EntityRepository(Lesson)
export class LessonsRepository extends Repository<Lesson> {
  // @InjectRepository(TeacherRepository)private lessonsRepository : LessonsRepository,

  // const teacherId = Repository<Teacher>.find(user.id);
  async createLesson(updateData, user): Promise<any> {
    const checkTeacher = await getRepository(Teacher)
      .createQueryBuilder("teacher")
      .where("teacher.userId = :id", { id: user.id })
      .getOne();

    const lesson = this.create({
      introduce: updateData.introduce,
      length: updateData.length,
      price: updateData.price,
      name: updateData.name,
      type: updateData.type,
      teacherId: checkTeacher.id,
    });

    await this.save(lesson);

    axios.post("http://localhost:4000/api/time-tables", {
      updateData,
      lessonId: lesson.id,
    });
    return lesson;
    // }
    // else{
    //   return "you are not teacher"
    // }
  }

  async updateLessonById(id, updateData, user): Promise<any> {
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

  async searchLesson(searchKeyword, user): Promise<Lesson[]> {
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
      .getMany();
    return result;
    //엔티티, 모듈, tensorflow 에 보내기
  }
}
