import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from 'src/entities/lesson.entity';
import { LessonsRepository } from './lessons.repository';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(LessonsRepository)
    private lessonsRepository: LessonsRepository, //
  ) {}

  async createLesson(updateData): Promise<Lesson> {
    return this.lessonsRepository.createLesson(updateData);
  }

  async getLessonById(id: number): Promise<Lesson> {
    const lesson = await this.lessonsRepository.findOne(id);
    if (!lesson) {
      throw new NotFoundException(`can't find lesson id ${id}`);
    }   return lesson;
  }
  
}
//asd