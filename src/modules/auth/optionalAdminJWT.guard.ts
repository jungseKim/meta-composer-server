import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalAdminJwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err, user, info) {
    if (user.is_admin == true) return user;
    else if (!user.is_admin == true) {
      throw new HttpException("You are not admin", HttpStatus.FORBIDDEN);
    }
  }
}

// import {
//   createParamDecorator,
//   ExecutionContext,
//   HttpException,
//   HttpStatus,
// } from "@nestjs/common";

// export const AdminDecorator = createParamDecorator(
//   async (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();

//     //user가 관리자인지 확인하는 데코레이터

//     if (request.user.is_admin == true) {
//       console.log("You are admin");
//       return true;
//     } else if (!request.user.is_admin == true) {
//       console.log("You are not admin");
//       throw new HttpException("You are not admin", HttpStatus.FORBIDDEN);
//     }
//   },
// );
