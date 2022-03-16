import { Module } from '@nestjs/common';
import { LessonsService } from '../lessons/lessons.service';
import { LessonsController } from '../lessons/lessons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsRepository } from '../lessons/lessons.repository';



@Module({
  imports: [TypeOrmModule.forFeature([LessonsRepository])],
  providers: [LessonsService,],
  controllers: [LessonsController],
})
export class LessonsModule {}
