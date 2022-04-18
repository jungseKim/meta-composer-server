import { Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
import { SearchHistory } from "src/entities/searchHistory.entiry";
import { SearchHistoriesService } from "./search-histories.service";

@Controller("api/search-histories")
export class SearchHistoriesController {
  constructor(private searchHistoriesService: SearchHistoriesService) {}

  // @Post()
  // @UseInterceptors(TransformResponseInterceptor)
  // saveSearchHistory(): Promise<SearchHistory[]> {
  //   return this.searchHistoriesService.saveSearchHistory();
  // }
}
