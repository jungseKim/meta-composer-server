import { imageOption } from "src/lib/imageOption";
import { FileInterceptor } from "@nestjs/platform-express";
import { UserService } from "../user/user.service";
import { find, retry } from "rxjs";
import { JwtRefreshGuard } from "./jwt-refresh.guard";
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Put,
  Redirect,
  Req,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { Request as Re, Response } from "express";
import { UserDecorator } from "src/decorators/user.decorator";
import { User } from "src/entities/user.entity";
import { JwtGuard } from "./jwt.guard";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
import { SetCookieInterceptor } from "src/common/interceptors/set-cookie.interceptor";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProfileDto } from "src/types/Profile";

@Controller("api/auth")
@ApiTags("유저/인증 API")
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post("/signUp")
  signUp(@Body("user") user) {
    // this.authService
    console.log(user);
  }

  @Post("/signIn")
  signIng(@Body("user") user) {
    // this.authService
    console.log(user);
  }

  @Get("/facebook")
  @UseGuards(AuthGuard("facebook"))
  @ApiOperation({
    summary: "페이스북 회원가입/로그인",
    description: "페이스북 회원가입/로그인",
  })
  @ApiResponse({ status: 200, description: "페이스북 로그인 완료", type: User })
  async facebookLogin(): Promise<any> {
    // return HttpStatus.OK;
  }

  @UseInterceptors(SetCookieInterceptor)
  @Get("/facebook/redirect")
  @Redirect(
    process.env.NODE_ENV === "dev"
      ? "http://localhost:3000"
      : "https://meta-composer-client.vercel.app",
  )
  @UseGuards(AuthGuard("facebook"))
  async facebookLoginRedirect(
    @UserDecorator() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.getJwtRefreshToken(user.id);

    // const refreshToken = this.authService.getJwtRefreshToken(user.id);
    // response.cookie('Refresh', refreshToken, {   httpOnly: true,   path: '/',
    // sameSite: 'lax',   maxAge: 3600000, }); return;
  }

  @UseGuards(JwtRefreshGuard)
  @Get("/refresh")
  @UseInterceptors(TransformResponseInterceptor)
  accessGet(
    @UserDecorator() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = this.authService.getJwtAccessToken(user.id);

    res.setHeader("Authorization", `Bearer ${accessToken}`);

    return;
  }

  //다른 라이브 러리 쓰면 nestjs 기능 과의 호한성이 사라져서 passthrough 를 로 명시해줘야함
  @UseInterceptors(SetCookieInterceptor)
  @Get("/login")
  async login(@Res({ passthrough: true }) response: Response) {
    const refreshToken = this.authService.getJwtRefreshToken(1);
    return refreshToken;
  }

  @Get("/")
  @UseGuards(JwtGuard)
  @UseInterceptors(TransformResponseInterceptor)
  async auth(
    @Res({ passthrough: true }) res: Response,
    @UserDecorator() user: User,
  ) {
    const userData = await this.userService.findOne(user.id);
    return userData;
  }

  @Get("/test")
  tec() {
    return process.env.NODE_ENV;
  }

  @Get("profile")
  @UseGuards(AuthGuard("jwt"))
  getProfile(@UserDecorator() user: User) {
    console.log(user.email + "   from controller");
    return user;
  }

  @Get("/google")
  @ApiOperation({
    summary: "구글 회원가입/로그인",
    description: "구글 회원가입/로그인",
  })
  @ApiResponse({ status: 200, description: "구글 로그인 완료", type: User })
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req) {
    console.log(req);
  }

  @UseInterceptors(SetCookieInterceptor)
  @Get("/google/redirect")
  @UseGuards(AuthGuard("google"))
  @Redirect(
    process.env.NODE_ENV === "dev"
      ? "http://localhost:3000"
      : "https://meta-composer-client.vercel.app",
  )
  async googleAuthRedirect(
    @UserDecorator() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(user + "data from user decorator");
    return this.authService.getJwtRefreshToken(user.id);
  }

  @Get("/logout")
  @ApiOperation({ summary: "로그아웃", description: "로그아웃" })
  @ApiResponse({ status: 200, description: "로그아웃완료", type: User })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("Refresh");

    return true;
  }

  @Patch("/user")
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(
    TransformResponseInterceptor,
    FileInterceptor("image", imageOption),
  )
  async userProfile(
    @UserDecorator() user: User,
    @UploadedFile() image,
    @Body() data: ProfileDto,
  ) {
    return this.authService.userProfileUpdate(user, image, data);
  }
}
