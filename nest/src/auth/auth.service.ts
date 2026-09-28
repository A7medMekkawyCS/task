import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { I18nContext } from 'nestjs-i18n';
import { PasswordService } from '../common/services/password.service';
import { UserPublic } from '../users/entities/user-public.entity';
import { UserRepository } from '../users/repositories/user.repository';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtPayload } from './entities/auth-user.entity';
import { IAuthService } from './interfaces/auth-service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async signup(dto: SignupDto): Promise<UserPublic> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      const message =
        I18nContext.current()?.t('common.EMAIL_EXISTS') ??
        'Email already registered';
      throw new ConflictException(message);
    }

    const hashedPassword = await this.passwordService.hash(dto.password);
    const user = await this.userRepository.create(dto.email, hashedPassword);

    const token = await this.createToken(user._id.toString(), user.email);
    return UserPublic.fromDocument(user, token);
  }

  async login(dto: LoginDto): Promise<UserPublic> {
    const user = await this.userRepository.findByEmail(dto.email);
    const invalidMessage =
      I18nContext.current()?.t('common.INVALID_CREDENTIALS') ??
      'Invalid email or password';

    if (!user) {
      throw new UnauthorizedException(invalidMessage);
    }

    const passwordMatches = await this.passwordService.compare(
      dto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException(invalidMessage);
    }

    const token = await this.createToken(user._id.toString(), user.email);
    return UserPublic.fromDocument(user, token);
  }

  private createToken(userId: string, email: string): Promise<string> {
    const payload = new JwtPayload(userId, email);
    return this.jwtService.signAsync({ ...payload });
  }
}
