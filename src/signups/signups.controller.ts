import { Body, Controller, Delete, HttpCode, HttpService, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from 'src/decorators/user.decorator';
import { Signup } from 'src/entities/signup.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { User } from 'src/entities/user.entity';
import { createQueryBuilder, QueryBuilder } from 'typeorm';
import { SignupsRepository } from './signups.repository';
import { SignupsService } from './signups.service';
import { AxiosResponse } from 'axios'

@Controller('api/signups')
@ApiTags('수강 등록 API')
export class SignupsController {
    constructor(private signupsService: SignupsService,
                private signupsRepository : SignupsRepository,
                // private  http: HttpCode
                ) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('/lessons/:id')
    @ApiOperation({ summary: '수강 등록', description: '수강등록을 한다. id 는 레슨의 id값' })
    async signup(@Param('id') id:number , @Body('merchant_uid') merchant_uid,@UserDecorator()user : User ): Promise<Signup> {



     return this.signupsService.signup(id,merchant_uid,user);

      // await this.http.post('http://localhost:4000/api/payments',merchant_uid).pipe(
      //   map(res=>res.data)
      // )

      // return;
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/lessons/:id')
    @ApiOperation({ summary: '수강 등록 취소', description: '수강등록 취소함. id 는 레슨의 id값' })
    async signupCancel(@Param('id') id:number ,@UserDecorator()user : User ): Promise<any> {
       createQueryBuilder('signup').delete()
       .where("signup.lessonId = :lessonid",{lessonid : id})
       .andWhere("signup.userId = :userid",{userid : user.id}).execute();
    }
}