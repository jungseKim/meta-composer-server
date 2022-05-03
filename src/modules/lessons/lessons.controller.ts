import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
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
import axios from "axios";
import { query } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { imageOption } from "src/lib/imageOption";
import { AppService } from "src/app.service";

import { OptionalJwtAuthGuard } from "../auth/optionalJwt.guard";

@Controller("api/lessons")
@ApiTags("레슨 API")
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}
  // @UseGuards(AuthGuard('jwt'))

  @Get()
  @ApiOperation({ summary: "전체레슨 조회", description: "전체 레슨 조회" })
  @ApiResponse({ status: 200, description: "레슨 조회완료", type: Lesson })
  @UseInterceptors(TransformResponseInterceptor)
  showAllLesson(
    @Query("page", ParseIntPipe) page: number,
    @Query("perPage", ParseIntPipe) perPage: number,
  ): Promise<Lesson[]> {
    return this.lessonsService.showAllLesson(page, perPage);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get("search")
  @ApiOperation({
    summary: "레슨 검색",
    description:
      "Query 파라미터 명은 -> searchKeyword  로 해주세요. page 는, 원하는 페이지 perPage는 한페이지에 얼마나 보여줄지 정합니다.",
  })
  @ApiResponse({ status: 200, description: "레슨 검색완료", type: Lesson })
  @UseInterceptors(TransformResponseInterceptor)
  searchLesson(
    @UserDecorator() user: User,
    @Query("searchKeyword") searchKeyword: string,
    @Query("page", ParseIntPipe) page: number,
    @Query("perPage", ParseIntPipe) perPage: number,
  ): Promise<Lesson[]> {
    return this.lessonsService.searchLesson(searchKeyword, user, page, perPage);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get("type")
  @ApiOperation({
    summary: "레슨 타입으로 검색",
    description:
      "Query 파라미터 명은 -> searchKeyword  로 해주세요. 가능한 파라미터- Sonata  Etudes Waltzes Nocturnes Marches . page 는, 원하는 페이지 perPage는 한페이지에 얼마나 보여줄지 정합니다.",
  })
  @ApiResponse({ status: 200, description: "레슨 검색완료", type: Lesson })
  @UseInterceptors(TransformResponseInterceptor)
  searchLessonbyType(
    @UserDecorator() user: User,
    @Query("searchKeyword") searchKeyword: string,
    @Query("page", ParseIntPipe) page: number,
    @Query("perPage", ParseIntPipe) perPage: number,
  ): Promise<Lesson[]> {
    return this.lessonsService.searchLessonbyType(
      searchKeyword,
      user,
      page,
      perPage,
    );
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get("/:id")
  @ApiOperation({
    summary: "특정 레슨 조회",
    description: "레슨의 ID값으로 특정레슨을 조회한다",
  })
  @ApiResponse({ status: 200, description: "특정 레슨 조회완료", type: Lesson })
  @UseInterceptors(TransformResponseInterceptor)
  async getLessonById(
    @UserDecorator() user: User,
    @Param("id", ParseIntPipe) id: number,
  ): Promise<Lesson> {
    console.log(user);
    return this.lessonsService.getLessonById(user, id);
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
  @UseInterceptors(FileInterceptor("image", imageOption))
  @UseInterceptors(TransformResponseInterceptor)
  create(
    @UploadedFile() image: any,
    @Body() updateData: Lesson,
    @UserDecorator() user: User,
    @TeacherDecorator() isTeacher: boolean,
  ): Promise<Lesson> {
    return this.lessonsService.createLesson(updateData, user, image);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("/:id")
  @ApiOperation({ summary: "레슨 삭제", description: "레슨을 삭제한다" })
  @ApiResponse({ status: 200, description: "레슨 삭제완료", type: Lesson })
  @UseInterceptors(TransformResponseInterceptor)
  deleteLessonById(
    @Param("id") id: number,
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
    @Param("id") id: number,
    @Body() updateData: Lesson,
    @UserDecorator() user: User,
    @TeacherDecorator() isTeacher: boolean,
  ): Promise<void> {
    return this.lessonsService.updateLessonById(id, updateData, user);
  }
}
