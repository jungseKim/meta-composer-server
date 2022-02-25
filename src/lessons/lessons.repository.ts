import { Lesson, LessonType } from 'src/entities/lesson.entity';
import { EntityRepository, Repository } from 'typeorm';


@EntityRepository(Lesson)
export class LessonsRepository extends Repository<Lesson> {
  async createLesson(updateData): Promise<Lesson> {
    const lesson = this.create({
      introduce: updateData.introduce,
      length: updateData.length,
      price: updateData.price,
      name: updateData.name,
      type: updateData.type,
      teacherId: updateData.teacherId,
    });

    await this.save(lesson);
    return lesson;
  }


}
//asd