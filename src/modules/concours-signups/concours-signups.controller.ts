import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
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
  @ApiOperation({ summary: "콩쿠르 참가", description: "콩쿠르에 감가한다" })
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
  ): Promise<ConcoursSignup> {
    return this.concoursSignupsService.participate(updateData, user, id);
  }
}
