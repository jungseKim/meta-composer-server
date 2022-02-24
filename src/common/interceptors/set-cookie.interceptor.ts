import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SetCookieInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap((refreshToken: string) => {
        response.cookie('Refresh', refreshToken, {
          httpOnly: true,
          sameSite: 'lax',
          maxAge:
            this.configService.get<number>(
              'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
            ) * 1000,
        });
      }),
    );
  }
}
