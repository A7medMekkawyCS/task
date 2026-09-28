import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class SecretKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const incomingKey = request.headers['secret_key'];
    const expectedKey = this.configService.get<string>('SECRET_KEY');

    if (!expectedKey || incomingKey !== expectedKey) {
      const message =
        I18nContext.current()?.t('common.INVALID_SECRET_KEY') ??
        'Invalid or missing secret key';
      throw new UnauthorizedException(message);
    }

    return true;
  }
}
