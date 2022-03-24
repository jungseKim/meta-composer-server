import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserDecorator } from "src/decorators/user.decorator";
import { Lesson } from "src/entities/lesson.entity";
import { User } from "src/entities/user.entity";
// import { TeacherGuard } from 'src/guards/teacherGuard';
import { LessonsService } from "./lessons.service";

@Controller("api/lessons")
@ApiTags("레슨 API")
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}
  // @UseGuards(AuthGuard('jwt'))

  @Get()
  @ApiOperation({ summary: "레슨 조회", description: "전체 레슨 조회" })
  @ApiResponse({ status: 200, description: "레슨 생성완료", type: Lesson })
  showAllLesson(): Promise<Lesson[]> {
    return this.lessonsService.showAllLesson();
  }
  @UseGuards(AuthGuard("jwt"))
  @Get("/:id")
  @ApiOperation({
    summary: "특정 레슨 조회",
    description: "레슨의 ID값으로 특정레슨을 조회한다",
  })
  @ApiResponse({ status: 200, description: "특정 레슨 조회완료", type: Lesson })
  getLessonById(@Param("id") id: number): Promise<Lesson> {
    return this.lessonsService.getLessonById(id);
  }
  @UseGuards(AuthGuard("jwt"))
  @Post()
  @ApiOperation({ summary: "레슨 생성", description: "레슨을 생성한다" })
  @ApiResponse({ status: 200, description: "레슨 생성완료", type: Lesson })
  @ApiBody({ type: Lesson })
  //type 를 entity 로
  create(@Body() updateData, @UserDecorator() user: User): Promise<Lesson> {
    return this.lessonsService.createLesson(updateData, user);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("/:id")
  @ApiOperation({ summary: "레슨 삭제", description: "레슨을 삭제한다" })
  @ApiResponse({ status: 200, description: "레슨 삭제완료", type: Lesson })
  deleteLessonById(@Param("id") id): Promise<void> {
    return this.lessonsService.deleteLessonById(id);
  }
}
