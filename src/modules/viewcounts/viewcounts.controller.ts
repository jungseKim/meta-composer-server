import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
import { UserDecorator } from "src/decorators/user.decorator";
import { User } from "src/entities/user.entity";
import { ViewCount } from "src/entities/viewCount.entity";
import { ViewcountsService } from "./viewcounts.service";

@ApiTags("조회수 저장용 API")
@Controller("api/viewcounts")
export class ViewcountsController {
  constructor(private viewcountsService: ViewcountsService) {}

  @Post()
  async counting(@Body() updateData): Promise<ViewCount> {
    return this.viewcountsService.counting(updateData);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("users")
  @UseInterceptors(TransformResponseInterceptor)
  async myViewHistory(@UserDecorator() user: User): Promise<any> {
    return this.viewcountsService.myViewHistory(user);
  }
}
