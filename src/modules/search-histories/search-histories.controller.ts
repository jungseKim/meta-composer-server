import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
import { UserDecorator } from "src/decorators/user.decorator";
import { SearchHistory } from "src/entities/searchHistory.entiry";
import { User } from "src/entities/user.entity";
import { SearchHistoriesService } from "./search-histories.service";

@Controller("api/search-histories")
export class SearchHistoriesController {
  constructor(private searchHistoriesService: SearchHistoriesService) {}

  // @Post()
  // @UseInterceptors(TransformResponseInterceptor)
  // saveSearchHistory(): Promise<SearchHistory[]> {
  //   return this.searchHistoriesService.saveSearchHistory();
  // }

  @UseGuards(AuthGuard("jwt"))
  @Get("users")
  @UseInterceptors(TransformResponseInterceptor)
  async mySearchHistory(@UserDecorator() user: User): Promise<SearchHistory[]> {
    return this.searchHistoriesService.mySearchHistory(user);
  }
}
