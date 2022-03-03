import { UserService } from './../user/user.service';
import { find, retry } from 'rxjs';
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
import { SetCookieInterceptor } from 'src/common/interceptors/set-cookie.interceptor';
import { ApiOperation } from '@nestjs/swagger';


@Controller('api/auth')
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
  @UseInterceptors(SetCookieInterceptor)
  @Get('/facebook/redirect')
  @Redirect(
    process.env.NODE_ENV === 'dev'
      ? 'localhost:3000'
      : 'https://meta-composer-client.vercel.app',
  )
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(
    @UserDecorator() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.getJwtRefreshToken(user.id);
    // const refreshToken = this.authService.getJwtRefreshToken(user.id);

    // response.cookie('Refresh', refreshToken, {
    //   httpOnly: true,
    //   path: '/',
    //   sameSite: 'lax',
    //   maxAge: 3600000,
    // });
    // return;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  @UseInterceptors(TransformResponseInterceptor)
  accessGet(
    @UserDecorator()
    user: User,
    @Res({ passthrough: true })
    res: Response,
  ) {
    const accessToken = this.authService.getJwtAccessToken(user.id);

    res.setHeader('Authorization', `Bearer ${accessToken}`);

    return;
  }

  //다른 라이브 러리 쓰면 nestjs 기능 과의 호한성이 사라져서
  //passthrough 를 로 명시해줘야함
  @Get('/login')
  async login(@Res({ passthrough: true }) response: Response,@UserDecorator()
  user: User,) {
    const refreshToken = this.authService.getJwtRefreshToken(user.id);
    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 36000000,
    });
    return;
  }

  @Get('/')
  @UseGuards(JwtGuard)
  @UseInterceptors(TransformResponseInterceptor)
  async auth(
    @Res({ passthrough: true }) res: Response,
    @UserDecorator() user: User,
  ) {
    console.log(user);
    const userData = await this.userService.findOne(user.id);

    return userData;
  }


  @Get('/test')
  tec() {
    return process.env.NODE_ENV;
  }






  @Get('profile')
  @UseGuards(JwtGuard)
  @UseInterceptors(TransformResponseInterceptor)
  getProfile(  
     @Res({ passthrough: true }) res: Response,
  @UserDecorator()user : User) {

    console.log(user);
      console.log(user.email + "   from controller")
      return user;
  }


  @Get('/google')
  @ApiOperation({summary: '구글 로그인', description: '구글 로그인하기'})
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req()req) {
      console.log(req)
  }

@UseInterceptors(SetCookieInterceptor)
@Get('/google/redirect')
// @Redirect('http://localhost:4000/')
@UseGuards(AuthGuard('google'))
// @Redirect('http://localhost:4000/api/auth/profile')
async googleAuthRedirect(
    @UserDecorator()user : User,
    @Res({passthrough: true})response : Response,
) {
    console.log(user + "data from user decorator");
    // const accessToken = this.authService.getJwtAccessToken(user.id);
    const refreshToken =this
        .authService
        .getJwtRefreshToken(user.id);

    // response.cookie('token', refreshToken, {     httpOnly: true,     path: '/',
    // sameSite: 'lax',     maxAge: 3600000 });
    response.setHeader('Authorization', `Bearer ${refreshToken}`);

    // return refreshToken;
    // response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
    // response.setHeader('Access-Control-Allow-Credentials', 'true');
    return {user, refreshToken};

}

@Get('/logout') 
async logout(@Res({passthrough: true})res : Response) {
    res.clearCookie('Refresh')

    return true;
}

}
