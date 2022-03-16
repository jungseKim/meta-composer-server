import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignmentsController } from "./assignments.controller";
import { AssignmentsRepository } from "./assignments.repository";

import { AssignmentsService } from "./assignments.service";

@Module({
  imports: [TypeOrmModule.forFeature([AssignmentsRepository])],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
})
export class AssignmentsModule {}
