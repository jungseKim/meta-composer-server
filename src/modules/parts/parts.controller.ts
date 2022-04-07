import { Controller, createParamDecorator, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PartsService } from "./parts.service";

@Controller("api/lessons/part")
export class PartsController {
  constructor(private partsService: PartsService) {}
  @Post()
  @ApiOperation({
    summary: "파트 정보 입력",
    description: `파트 정보 입력한다.<br>
                    form데이터로<br>
                    squence (순서정보) 예시 : 1 (number)<br>
                    handTracking : "string"<br>
                    audio : "string"<br>
                    pianoEvent: "string"<br>
                    `,
  })
  @ApiResponse({ status: 200, description: "파트 정보 입력완료" })
  createPart() {
    return this.partsService.createPart();
  }
}
