import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
import { TeacherDecorator } from "src/decorators/teacher.decorator";
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
  @ApiResponse({ status: 200, description: "레슨 조회완료", type: Lesson })
  @UseInterceptors(TransformResponseInterceptor)
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
  @UseInterceptors(TransformResponseInterceptor)
  getLessonById(@Param("id") id: number): Promise<Lesson> {
    return this.lessonsService.getLessonById(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  @ApiOperation({
    summary: "레슨 생성",
    description: `레슨을 생성한다 <br>
  { <br>
  "introduce": "레슨 샘플입니다.", <br>
  "length": "00:30:00", <br>
  "price": 200000, <br>
  "name": "레슨제목 입니다.", <br>
  "type": "Sonata", <br>
  "day": ["1","2","5","6","7"], <br>
  //요일, 1부터 일요일 7은 토요일 <br>
  "time":[ <br>
            ["11:00:00"], <br>
            ["08:00:00","10:00:00","18:00:00"], <br>
            ["08:00:00","10:00:00"], <br>
            ["08:00:00","10:00:00","13:00:00","14:00:00"], <br>
            ["08:00:00","10:00:00","13:00:00"] <br>
    ] <br>
    //시간 양식을 지켜주세요. <br>
} <br>
의 양식으로 데이터 보내야함. <br>
`,
  })
  @ApiResponse({ status: 200, description: "레슨 생성완료", type: Lesson })
  @ApiBody({ type: Lesson })
  //type 를 entity 로
  @UseInterceptors(TransformResponseInterceptor)
  create(
    @Body() updateData,
    @UserDecorator() user: User,
    @TeacherDecorator() isTeacher: boolean,
  ): Promise<Lesson> {
    return this.lessonsService.createLesson(updateData, user);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("/:id")
  @ApiOperation({ summary: "레슨 삭제", description: "레슨을 삭제한다" })
  @ApiResponse({ status: 200, description: "레슨 삭제완료", type: Lesson })
  @UseInterceptors(TransformResponseInterceptor)
  deleteLessonById(
    @Param("id") id,
    @TeacherDecorator() isTeacher: boolean,
  ): Promise<void> {
    return this.lessonsService.deleteLessonById(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch("/:id")
  @ApiOperation({ summary: "레슨 수정", description: "레슨을 수정한다" })
  @ApiResponse({ status: 200, description: "레슨 수정완료", type: Lesson })
  @UseInterceptors(TransformResponseInterceptor)
  updateLessonById(
    @Param("id") id,
    @Body() updateData,
    @UserDecorator() user: User,
    @TeacherDecorator() isTeacher: boolean,
  ): Promise<void> {
    return this.lessonsService.updateLessonById(id, updateData, user);
  }
}
