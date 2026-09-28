import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
} from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { MessageResult } from '../common/responses/message-result';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { AuthUser } from './entities/auth-user.entity';
import { AUTH_SERVICE } from './interfaces/auth-service.interface';
import type { IAuthService } from './interfaces/auth-service.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  @Public()
  @Post('signup')
  async signup(
    @Body() dto: SignupDto,
    @I18n() i18n: I18nContext,
  ): Promise<MessageResult> {
    const data = await this.authService.signup(dto);
    return new MessageResult(i18n.t('common.SIGNUP_SUCCESS'), data);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @I18n() i18n: I18nContext,
  ): Promise<MessageResult> {
    const data = await this.authService.login(dto);
    return new MessageResult(i18n.t('common.LOGIN_SUCCESS'), data);
  }

  @Get('profile')
  async getProfile(
    @Req() req: { user: AuthUser },
    @I18n() i18n: I18nContext,
  ): Promise<MessageResult> {
    const data = await this.authService.profile(req.user);
    return new MessageResult(i18n.t('common.PROFILE_SUCCESS'), data);
  }
}
