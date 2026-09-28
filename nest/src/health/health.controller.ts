import { Controller, Get } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Public } from '../auth/decorators/public.decorator';
import { MessageResult } from '../common/responses/message-result';

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  check(@I18n() i18n: I18nContext): MessageResult {
    return new MessageResult(i18n.t('common.HEALTH_OK'), {
      status: 'ok',
    });
  }
}
