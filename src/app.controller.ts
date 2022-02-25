import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('abc')
  @ApiOperation({ summary: '결제 예시', description: '레슨 ID값을 넣어 강의에 등록하며 결제한다. ' })
  get(@Res() res: Response) {
    res.sendFile('abc.html', {
      root: './src/',
    });
  }
}
//