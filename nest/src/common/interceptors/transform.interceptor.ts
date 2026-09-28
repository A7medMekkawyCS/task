import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../responses/api-response';
import { MessageResult } from '../responses/message-result';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse> {
    const httpResponse = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((payload: unknown) => {
        const status = httpResponse.statusCode || 200;

        if (payload instanceof MessageResult) {
          return ApiResponse.success(status, payload.message, payload.data);
        }

        if (
          payload !== null &&
          typeof payload === 'object' &&
          'data' in (payload as Record<string, unknown>)
        ) {
          const body = payload as { message?: string; data: unknown };
          return ApiResponse.success(
            status,
            body.message ?? 'OK',
            body.data ?? {},
          );
        }

        return ApiResponse.success(status, 'OK', payload ?? {});
      }),
    );
  }
}
