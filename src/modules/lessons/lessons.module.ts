import { Module } from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { LessonsController } from "./lessons.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LessonsRepository } from "./lessons.repository";
import { SearchHistoriesRepository } from "../search-histories/search-histories.repository";

@Module({
  imports: [TypeOrmModule.forFeature([LessonsRepository])],
  providers: [LessonsService],
  controllers: [LessonsController],
})
export class LessonsModule {}
