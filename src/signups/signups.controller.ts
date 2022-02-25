import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Signup } from 'src/entities/signup.entity';
import { SignupsService } from './signups.service';

@Controller('signups')
@ApiTags('수강 등록 API')
export class SignupsController {
    constructor(private signupsService: SignupsService) {}

    @Post('/lessons/:id')
    @ApiOperation({ summary: '수강 등록', description: '수강등록을 한다.' })
    signup(@Param('id') id:number , @Body('merchant_uid') merchant_uid): Promise<Signup> {
      return this.signupsService.signup(id,merchant_uid);
    }
}
//