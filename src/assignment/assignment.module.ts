import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentController } from './assignment.controller';
import { AssignmentRepository } from './assignment.repository';
import { AssignmentService } from './assignment.service';

@Module({

  imports : [TypeOrmModule.forFeature([AssignmentRepository])],
  controllers: [AssignmentController],
  providers: [AssignmentService],
})
export class AssignmentModule {}
