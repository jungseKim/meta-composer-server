import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsRepository } from './lessons.repository';
import { TeachersRepository } from 'src/teachers/teachers.repository';
// import { TeacherGuard } from 'src/guards/teacherGuard';

@Module({
  imports: [TypeOrmModule.forFeature([LessonsRepository])],
  providers: [LessonsService,],
  controllers: [LessonsController],
})
export class LessonsModule {}
//TeacherGuard