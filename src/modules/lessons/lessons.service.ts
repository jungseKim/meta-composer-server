import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Lesson} from 'src/entities/lesson.entity';
import {LessonsRepository} from './lessons.repository';

@Injectable()
export class LessonsService {
    constructor(
        @InjectRepository(LessonsRepository) private lessonsRepository : LessonsRepository,
        //
    ) {}

    async showAllLesson(): Promise<Lesson[]>{
      return this.lessonsRepository.find();
      //findAll
    }

    async createLesson(updateData,user): Promise<Lesson> {
        return this
            .lessonsRepository
            .createLesson(updateData,user);
    }

    async getLessonById(id : number): Promise<Lesson> {
        const lesson = await this
            .lessonsRepository
            .findOne(id);
        if (!lesson) {
            throw new NotFoundException(`can't find lesson id ${id}`);
        }
        return lesson;
    }

    async deleteLessonById(id : number):Promise<void>{

      await this.lessonsRepository.delete(id);
      
    }

}
