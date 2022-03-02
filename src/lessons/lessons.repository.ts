import { InjectRepository } from '@nestjs/typeorm';
import { Lesson, LessonType } from 'src/entities/lesson.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { EntityRepository, Repository } from 'typeorm';


@EntityRepository(Lesson)
export class LessonsRepository extends Repository<Lesson> {
  // @InjectRepository(TeacherRepository)private lessonsRepository : LessonsRepository,

  // const teacherId = Repository<Teacher>.find(user.id);
  async createLesson(updateData,user): Promise<Lesson> {


    const lesson = this.create({
      introduce: updateData.introduce,
      length: updateData.length,
      price: updateData.price,
      name: updateData.name,
      type: updateData.type,
      teacherId: user.id,
    });

    await this.save(lesson);
    return lesson;
  }


}
