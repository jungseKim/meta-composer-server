import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { identity } from "rxjs";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
import { UserDecorator } from "src/decorators/user.decorator";
import { Assignment } from "src/entities/assignment.entity";
import { User } from "src/entities/user.entity";
import { AssignmentsService } from "./assignments.service";

@Controller("api/assignments")
@ApiTags("과제 API")
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  @Post()
  @ApiOperation({ summary: "과제 생성", description: "과제를 생성합니다" })
  @ApiResponse({
    status: 200,
    description: "과제 생성 완료",
    type: Assignment,
  })
  @ApiBody({ type: Assignment })
  @UseInterceptors(TransformResponseInterceptor)
  createAssignment(@Body() updatedData: Assignment): Promise<Assignment> {
    return this.assignmentsService.createAssignment(updatedData);
  }

  @Delete(":id")
  @ApiOperation({ summary: "과제 삭제", description: "과제를 삭제합니다" })
  @ApiResponse({
    status: 200,
    description: "과제 삭제 완료",
    type: Assignment,
  })
  @UseInterceptors(TransformResponseInterceptor)
  deleteAssignment(@Param("id") id: number) {
    return this.assignmentsService.deleteAssignment(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  @ApiOperation({
    summary: "과제 조회",
    description: "현재 로그인된 유저의 과제를 조회합니다",
  })
  @ApiResponse({
    status: 200,
    description: "과제 조회 완료",
    type: Assignment,
  })
  @UseInterceptors(TransformResponseInterceptor)
  getAllAssignmentbyUserId(@UserDecorator() user: User): Promise<Assignment[]> {
    return this.assignmentsService.getAllMyAssignment(user);
  }
}
