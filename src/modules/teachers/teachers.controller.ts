import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserDecorator } from "src/decorators/user.decorator";
import { Teacher } from "src/entities/teacher.entity";
import { User } from "src/entities/user.entity";
import { TeachersRepository } from "./teachers.repository";
import { TeachersService } from "./teachers.service";
import { getConnection } from "typeorm";
import { TeacherDTO } from "./dto/teachers.dto";

//
import { upload } from "youtube-videos-uploader";
import { TeacherDecorator } from "src/decorators/teacher.decorator";
import { JwtGuard } from "../auth/jwt.guard";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
//

@Controller("api/teachers")
@ApiTags("강사 API")
export class TeachersController {
  constructor(
    private teachersSerice: TeachersService,
    private teachersRepository: TeachersRepository,
  ) {}
  @UseGuards(AuthGuard("jwt"))
  @Get()
  @ApiOperation({
    summary: "강사 조회",
    description: "메타 컨포저에 등록된 강사들 조회",
  })
  @ApiResponse({ status: 200, description: "강사 조회 완료", type: Teacher })
  @UseInterceptors(TransformResponseInterceptor)
  findAllTeachers() {
    // @Body("video") video
    // if (isTeacher == false) {
    //   throw new HttpException("You are not teacher", HttpStatus.FORBIDDEN);
    // }
    // const credentials = {
    //   email: process.env.G_ID,
    //   pass: process.env.G_PASSWORD,
    //   recoveryemail: process.env.G_RECOVEREMAIL,
    // };

    // const onVideoUploadSuccess = (videoUrl) => {
    //   console.log(videoUrl);
    // };
    // console.log(video);
    // const video1 = {
    //   path: video,
    //   title: "왜옹",
    //   description: "upload test",
    //   thumbnail:
    //     "C:/Users/song/Desktop/bird/meta-composer-server/src/modules/teachers/cat.png",
    //   language: "korean",
    //   tags: ["video"],
    //   channelName: "송재현",

    //   onSuccess: onVideoUploadSuccess,
    //   skipProcessingWait: true,
    //   onProgress: (progress) => {
    //     console.log("now progress ==>", progress);
    //   },
    // };

    // upload(credentials, [video1], { headless: false }).then(console.log);

    return this.teachersRepository.find();
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  @ApiOperation({ summary: "강사 등록", description: "강사를 등록한다" })
  @ApiResponse({ status: 200, description: "강사 등록 완료", type: Teacher })
  @ApiBody({ type: Teacher })
  @UseInterceptors(TransformResponseInterceptor)
  registerTeacher(
    @UserDecorator() user: User,
    @Body() updateData: TeacherDTO,
  ): Promise<Teacher> {
    return this.teachersSerice.registerTeacher(user, updateData);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch()
  @ApiOperation({ summary: "강사 정보 업데이트" })
  @ApiResponse({
    status: 200,
    description: "강사 정보 업데이트 완료",
    type: Teacher,
  })
  @ApiBody({ type: Teacher })
  @UseInterceptors(TransformResponseInterceptor)
  async updateTeacherInfo(
    @UserDecorator() user: User,
    @Body() updateData: TeacherDTO,
    @TeacherDecorator() isTeacher: boolean,
  ): Promise<Teacher> {
    return this.teachersSerice.updateTeacherInfo(user, updateData);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete()
  @ApiOperation({ summary: "강사 등록 취소" })
  @ApiResponse({
    status: 200,
    description: "강사 등록 취소 완료",
    type: Teacher,
  })
  @UseInterceptors(TransformResponseInterceptor)
  async unRegisterTeacher(
    @UserDecorator() user: User,
    @TeacherDecorator() isTeacher: boolean,
  ) {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Teacher)
      .where("userId = :id", { id: user.id })
      .execute();
  }
}
