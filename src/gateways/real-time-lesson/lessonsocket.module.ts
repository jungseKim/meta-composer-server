/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonRoom } from 'src/entities/lessonRoom.entity';
import { User } from 'src/entities/user.entity';
import { LessonGateway } from './lesson.gateway';
import { LessonService } from './lesson.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, LessonRoom])],
  controllers: [],
  providers: [LessonGateway, LessonService],
})
export class LessonSocketModule {}
