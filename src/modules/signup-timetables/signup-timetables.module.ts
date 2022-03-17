import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SignupTimetablesController } from "./signup-timetables.controller";
import { SignuptimetablesRepository } from "./signup-timetables.repository";
import { SignupTimetablesService } from "./signup-timetables.service";

@Module({
  imports: [TypeOrmModule.forFeature([SignuptimetablesRepository])],
  controllers: [SignupTimetablesController],
  providers: [SignupTimetablesService],
})
export class SignupTimetablesModule {}
