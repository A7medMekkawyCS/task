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
    const lang = this.normalizeLang(
      I18nContext.current()?.lang || request.headers?.['lang'] || 'en',
    );

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = this.translateMessage(exceptionResponse, lang);
      } else if (typeof exceptionResponse === 'object' && exceptionResponse) {
        const body = exceptionResponse as {
          message?: string | string[];
          error?: string;
        };

        if (Array.isArray(body.message)) {
          message = body.message
            .map((msg) => this.translateMessage(String(msg), lang))
            .join(', ');
        } else if (typeof body.message === 'string') {
          message = this.translateMessage(body.message, lang);
        } else if (body.error) {
          message = this.translateMessage(body.error, lang);
        }
      }

      if (
        statusCode === HttpStatus.UNAUTHORIZED &&
        (message === 'Unauthorized' || message === 'unauthorized')
      ) {
        message = this.translateMessage('TOKEN_REQUIRED', lang);
      }
    }

    response.status(statusCode).json(ApiResponse.error(statusCode, message));
  }

  private normalizeLang(lang: string): string {
    return String(lang || 'en')
      .toLowerCase()
      .split(/[-_,;]/)[0]
      .trim() || 'en';
  }

  private translateMessage(message: string, lang: string): string {
    const shortKey = message.replace(/^common\./, '');

    // Plain text (not an i18n key) — return as-is
    if (!/^[A-Z][A-Z0-9_]*$/.test(shortKey)) {
      return message;
    }

    const fullKey = `common.${shortKey}`;
    const translated = this.i18n.t(fullKey, { lang });

    if (
      typeof translated === 'string' &&
      translated.length > 0 &&
      translated !== fullKey &&
      translated !== shortKey
    ) {
      return translated;
    }

    // Fallback if loader did not resolve the key
    const fallbacks: Record<string, Record<string, string>> = {
      en: {
        TOKEN_REQUIRED: 'Token is required',
        TOKEN_INVALID: 'Invalid or expired token',
        UNAUTHORIZED: 'Unauthorized',
      },
      ar: {
        TOKEN_REQUIRED: 'التوكن مطلوب',
        TOKEN_INVALID: 'التوكن غير صالح أو منتهي',
        UNAUTHORIZED: 'غير مصرح',
      },
    };

    return fallbacks[lang]?.[shortKey] || fallbacks.en[shortKey] || message;
  }
}
