import { Lesson } from 'src/entities/lesson.entity';

export class LessonsDto {
  introduce: string;

  length: number;

  price: number;

  name: string;

  type: string;

  teacherId: number;
}
