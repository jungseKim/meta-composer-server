import { Module } from '@nestjs/common';
import { ConcoursService } from '../concours/concours.service';
import { ConcoursController } from '../concours/concours.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcoursRepository } from '../concours/concours.repository';

@Module({
  imports:[TypeOrmModule.forFeature([ConcoursRepository])],
  providers: [ConcoursService],
  controllers: [ConcoursController]
})
export class ConcoursModule {}
