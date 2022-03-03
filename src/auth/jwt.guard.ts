import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements CanActivate {

    handleRequest(err, user, info,context) {
        console.log({ err, user, info,context });
        return super.handleRequest(err, user, info,context);
      }

      canActivate(
        context: ExecutionContext
      ): boolean | Promise<boolean> | Observable<boolean> {
        return true;
      }
      
}
