import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ApiResponse } from '../responses/api-response';

@Injectable()
@Catch()
export class I18nHttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<{ headers?: Record<string, string> }>();
    const lang =
      I18nContext.current()?.lang ||
      request.headers?.['lang'] ||
      'en';

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse) {
        const body = exceptionResponse as {
          message?: string | string[];
          error?: string;
        };

        if (Array.isArray(body.message)) {
          // Translate each validation message key, e.g. EMAIL_REQUIRED
          message = body.message
            .map((msg) => this.translateMessage(msg, lang))
            .join(', ');
        } else if (typeof body.message === 'string') {
          message = this.translateMessage(body.message, lang);
        } else if (body.error) {
          message = body.error;
        }
      }

      if (
        statusCode === HttpStatus.UNAUTHORIZED &&
        message === 'Unauthorized'
      ) {
        message = this.i18n.translate('common.UNAUTHORIZED', {
          lang,
        }) as string;
      }
    }

    response.status(statusCode).json(ApiResponse.error(statusCode, message));
  }

  private translateMessage(message: string, lang: string): string {
    const key = message.startsWith('common.')
      ? message
      : `common.${message}`;

    const translated = this.i18n.translate(key, { lang }) as string;

    // If key is missing, nestjs-i18n may return the key itself
    if (!translated || translated === key || translated === message) {
      const fallback = this.i18n.translate(`common.${message}`, {
        lang,
      }) as string;
      return fallback && fallback !== `common.${message}`
        ? fallback
        : message;
    }

    return translated;
  }
}
