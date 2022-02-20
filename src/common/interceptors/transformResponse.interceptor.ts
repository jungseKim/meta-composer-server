import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { statusCode } = response;

    if (request.path.match(/\/auth\/\w+\/redirect/)) {
      return next.handle();
    }

    return next.handle().pipe(
      map((payload) => ({
        success: true,
        statusCode,
        payload,
      })),
    );
  }
}
