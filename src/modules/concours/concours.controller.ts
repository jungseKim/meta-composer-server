import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
import { Concours } from "src/entities/concours.entity";
import { imageOption } from "src/lib/imageOption";
import { sheetOption } from "src/lib/sheetOption";
import { ConcoursService } from "./concours.service";

@Controller("api/concours")
@ApiTags("콩쿠르 API")
export class ConcoursController {
  constructor(private concoursService: ConcoursService) {}

  @Get()
  @ApiOperation({
    summary: "콩쿠르 전체 조회",
    description: "콩쿠르 전체 조회",
  })
  @ApiResponse({
    status: 200,
    description: "콩쿠르 전체 조회완료",
    type: Concours,
  })
  @UseInterceptors(TransformResponseInterceptor)
  showAllConcours() {
    return this.concoursService.showAllConcours();
  }

  @Get("/:id")
  @ApiOperation({
    summary: "특정 콩쿠르 ID로 조회",
    description: "특정 콩쿠르 ID로 조회",
  })
  @ApiResponse({
    status: 200,
    description: "특정 콩쿠르 조회완료",
    type: Concours,
  })
  @UseInterceptors(TransformResponseInterceptor)
  getConcoursById(@Param("id") id: number) {
    return this.concoursService.getConcoursById(id);
  }

  @Post()
  @ApiOperation({
    summary: "콩쿠르 생성",
    description:
      "콩쿠르 생성(form)price concoursSignupStartTime concoursSignupFinishTime startTime finishTime title contents (file )image  의 데이터를 보내주세요.",
  })
  @ApiResponse({ status: 200, description: "콩쿠르 생성완료", type: Concours })
  @ApiBody({ type: Concours })
  @UseInterceptors(FileInterceptor("image", imageOption))
  @UseInterceptors(TransformResponseInterceptor)
  async createConcours(
    @UploadedFile() image,
    @Body() updateData,
  ): Promise<Concours> {
    console.log(image);
    return this.concoursService.createConcours(updateData, image);
  }

  @Delete("/:id")
  @ApiOperation({ summary: "콩쿠르 삭제", description: "콩쿠르 삭제한다" })
  @ApiResponse({ status: 200, description: "콩쿠르 삭제완료", type: Concours })
  @UseInterceptors(TransformResponseInterceptor)
  deleteConcours(@Param("id") id: number) {
    return this.concoursService.deleteConcours(id);
  }

  @Put("/:id")
  @ApiOperation({
    summary: "콩쿠르 정보 수정",
    description: "콩쿠르 정보 수정",
  })
  @ApiResponse({
    status: 200,
    description:
      "콩쿠르 수정(form)price concoursSignupStartTime concoursSignupFinishTime startTime finishTime title contents (file )image  의 데이터를 보내주세요.",
    type: Concours,
  })
  @ApiBody({ type: Concours })
  @UseInterceptors(FileInterceptor("image", imageOption))
  @UseInterceptors(TransformResponseInterceptor)
  async updateConcours(
    @Param("id") id: number,
    @UploadedFile() image,
    @Body() updateData,
  ) {
    return this.concoursService.updateConcours(id, updateData, image);
  }
}
