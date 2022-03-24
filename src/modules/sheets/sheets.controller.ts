import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserDecorator } from "src/decorators/user.decorator";
import { Sheet } from "src/entities/sheet.entity";
import { User } from "src/entities/user.entity";
import { multerOptions } from "src/lib/multerOptions";
import { sheetOption } from "src/lib/sheetOption";
import SheetsRepository from "./sheets.repository";
import { SheetsService } from "./sheets.service";

@Controller("api/sheets")
@ApiTags("악보 업로드 API")
export class SheetsController {
  constructor(
    private sheetsService: SheetsService,
    private sheetsRepository: SheetsRepository,
  ) {}

  @UseGuards(AuthGuard("jwt"))
  @Post()
  @ApiOperation({ summary: "악보 업로드", description: "악보를 업로드 한다." })
  @ApiResponse({ status: 200, description: "악보를 업로드 완료", type: Sheet })
  @ApiBody({ type: Sheet })
  @UseInterceptors(FileInterceptor("sheet", sheetOption))
  async uploadSheets(
    @UploadedFile() sheet,
    @UserDecorator() user: User,
    @Body() updateData,
  ): Promise<Sheet> {
    console.log(sheet);

    return this.sheetsService.uploadSheets(user, sheet, updateData);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  @ApiOperation({
    summary: "공개 악보 모두 조회",
    description: "isOpen이 true 인 악보만 모두 조회한다.",
  })
  async showPublicSheets(): Promise<Sheet[]> {
    return this.sheetsRepository.find({ where: [{ isOpen: true }] });
  }
}
