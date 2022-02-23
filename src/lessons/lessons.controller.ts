import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Lesson } from 'src/entities/lesson.entity';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Post()
  create(@Body() updateData): Promise<Lesson> {
    return this.lessonsService.createLesson(updateData);
  }

  @Get('/:id')
  getLessonById(@Param('id') id:number):Promise<Lesson>{
    return this.lessonsService.getLessonById(id);
  }

}
