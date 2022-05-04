import { Module } from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { LessonsController } from "./lessons.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LessonsRepository } from "./lessons.repository";
import { SearchHistoriesRepository } from "../search-histories/search-histories.repository";
import { SearchHistoriesModule } from "../search-histories/search-histories.module";
import { SearchHistory } from "src/entities/searchHistory.entiry";
import { ViewcountsService } from "../viewcounts/viewcounts.service";
import { ViewcountsModule } from "../viewcounts/viewcounts.module";
import { TimeTablesModule } from "../time-tables/time-tables.module";

@Module({
  imports: [
    ViewcountsModule,
    TypeOrmModule.forFeature([LessonsRepository, SearchHistory]),
    TimeTablesModule,
  ],
  providers: [LessonsService],
  controllers: [LessonsController],
})
export class LessonsModule {}
