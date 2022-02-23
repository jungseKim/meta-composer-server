import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { Signup } from 'src/entities/signup.entity';
import { SignupsService } from './signups.service';

@Controller('signups')
export class SignupsController {
    constructor(private signupsService: SignupsService) {}

    @Post('/lessons/:id')
    signup(@Param('id') id:number , @Body('merchant_uid') merchant_uid): Promise<Signup> {
      return this.signupsService.signup(id,merchant_uid);
    }
}
