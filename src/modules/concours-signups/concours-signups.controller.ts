import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
import { UserDecorator } from "src/decorators/user.decorator";
import { ConcoursSignup } from "src/entities/concoursSignup.entity";
import { User } from "src/entities/user.entity";
import { ConcoursSignupsService } from "./concours-signups.service";

@Controller("api/concours-signups")
@ApiTags("콩쿠르 참가 API")
export class ConcoursSignupsController {
  constructor(private concoursSignupsService: ConcoursSignupsService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("/:id")
  @ApiOperation({ summary: "콩쿠르 참가", description: "콩쿠르에 참가한다" })
  @ApiResponse({
    status: 200,
    description: "콩쿠르 참가 완료",
    type: ConcoursSignup,
  })
  @ApiBody({ type: ConcoursSignup })
  //type 를 entity 로
  async participate(
    @Param("id") id: number,
    @Body() updateData,
    @UserDecorator() user: User,
  ) {
    return this.concoursSignupsService.participate(updateData, user, id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("check/:id")
  @ApiOperation({
    summary: "콩쿠르 등록유무확인",
    description: "콩쿠르 참가전 이미 등록했는지 확인하는 API",
  })
  @ApiResponse({
    status: 200,
    description: "콩쿠르 등록 가능",
    type: ConcoursSignup,
  })
  @ApiBody({ type: ConcoursSignup })
  async check(@Param("id") id: number, @UserDecorator() user: User) {
    return this.concoursSignupsService.check(user, id);
  }
}
