import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsController } from '../assignments/assignments.controller';
import { AssignmentsRepository } from '../assignments/assignments.repository';

import { AssignmentsService } from '../assignments/assignments.service';

@Module({

  imports : [TypeOrmModule.forFeature([AssignmentsRepository])],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
})
export class AssignmentsModule {}
