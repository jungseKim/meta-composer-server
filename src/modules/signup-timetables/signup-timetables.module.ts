import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Signup } from "src/entities/signup.entity";
import { SignupTimetablesController } from "./signup-timetables.controller";
import { SignuptimetablesRepository } from "./signup-timetables.repository";
import { SignupTimetablesService } from "./signup-timetables.service";

@Module({
  imports: [TypeOrmModule.forFeature([SignuptimetablesRepository, Signup])],
  controllers: [SignupTimetablesController],
  providers: [SignupTimetablesService],
  exports: [SignupTimetablesService],
})
export class SignupTimetablesModule {}
