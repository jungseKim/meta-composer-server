import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SearchHistoriesController } from "./search-histories.controller";
import { SearchHistoriesRepository } from "./search-histories.repository";
import { SearchHistoriesService } from "./search-histories.service";

@Module({
  imports: [TypeOrmModule.forFeature([SearchHistoriesRepository])],
  controllers: [SearchHistoriesController],
  providers: [SearchHistoriesService],
})
export class SearchHistoriesModule {}
