import { UserService } from './../user/user.service';
import { find } from 'rxjs';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Redirect,
  Req,
  Request,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request as Re, Response } from 'express';
import { UserDecorator } from 'src/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { JwtGuard } from './jwt.guard';
import { TransformResponseInterceptor } from 'src/common/interceptors/transformResponse.interceptor';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/signUp')
  signUp(@Body('user') user) {
    // this.authService
    console.log(user);
  }

  @Post('/signIn')
  signIng(@Body('user') user) {
    // this.authService
    console.log(user);
  }
  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    // return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @Redirect('http://localhost:3000')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(
    @UserDecorator() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = this.authService.getJwtRefreshToken(user.id);

    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 3600000,
    });
    return;
  }

  // @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  accessGet(
    // @UserDecorator()
    // user: User,
    @Res({ passthrough: true })
    res: Response,
  ) {
    const accessToken = this.authService.getJwtAccessToken(1);

    res.setHeader('Authorization', `Bearer ${accessToken}`);

    return '1';
  }

  //다른 라이브 러리 쓰면 nestjs 기능 과의 호한성이 사라져서
  //passthrough 를 로 명시해줘야함
  @Get('/login')
  async login(@Res({ passthrough: true }) response: Response) {
    const refreshToken = this.authService.getJwtRefreshToken(1);
    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 36000000,
    });
    return;
  }

  @Get('/')
  // @UseGuards(JwtGuard)
  @UseInterceptors(TransformResponseInterceptor)
  async auth(
    @Res({ passthrough: true }) res: Response,
    @UserDecorator() user: User,
  ) {
    // const userData = await this.userService.findOne(user.id);
    const userData = {
      id: '1',
      email: 'test@test.com',
      username: 'test',
      image: 'https://via.placeholder.com/256',
      provider: 'facebook',
      socialId: '123456789',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    return userData;
    // return res;
  }
}
