import {JwtRefreshGuard} from './jwt-refresh.guard';
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Redirect,
    Req,
    Request,
    Res,
    UseGuards
} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {AuthService} from './auth.service';
import {Request as Re, Response} from 'express';
import {UserDecorator} from 'src/decorators/user.decorator';
import {User} from 'src/entities/user.entity';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {UserService} from 'src/user/user.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@ApiTags('인증 API')
export class AuthController {
    constructor(
        private authService : AuthService,
        private userService : UserService
    ) {}



    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@UserDecorator() user: User) {
        return user;
      }


    @Get('/google')
    @ApiOperation({summary: '구글 로그인', description: '구글 로그인하기'})
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req()req) {
        console.log(req)
    }

    @Get('/google/redirect')
    @UseGuards(AuthGuard('google'))
    @Redirect('http://localhost:4000')
    async googleAuthRedirect(
        @UserDecorator()user : User,
        @Res({passthrough: true})response : Response,
    ) {

        const refreshToken = this
            .authService
            .getJwtRefreshToken(user.id);
        response.cookie('Refresh', refreshToken, {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            maxAge: 3600000
        });
        return;
        // return this.authService.googleLogin(req)
    }

    @Post('/signUp')
    signUp(@Body('user')user) {
        // this.authService
        console.log(user);
    }

    @Post('/signIn')
    signIng(@Body('user')user) {
        // this.authService
        console.log(user);
    }

    @Get('/logout')
    async logout(@Res({passthrough: true})res : Response) {
        res.clearCookie('Refresh');
        return true;
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
        @UserDecorator()user : User,
        @Res({passthrough: true})response : Response,
    ) {
        const refreshToken = this
            .authService
            .getJwtRefreshToken(user.id);

        response.cookie('Refresh', refreshToken, {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            maxAge: 3600000
        });
        return;
    }
    @UseGuards(JwtRefreshGuard)
    @Get('/refresh')
    accessGet(
        @Request()req : Re,
        @UserDecorator()user : User,
        @Res()res : Response,
    ) {
        const accessToken = this
            .authService
            .getJwtAccessToken(user.id);

        res.setHeader('Authorization', `Bearer ${accessToken}`);
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        return user;
    }

    @Get('/test')
    @Redirect('http://localhost:3000')
    async findAll(@Res({passthrough: true})response : Response) {
        const refreshToken = await this
            .authService
            .getJwtRefreshToken(1);
        response.cookie('Refresh', refreshToken, {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            maxAge: 36000000
        });
        return '1';
    }


}
