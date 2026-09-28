import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUser, JwtPayload } from './entities/auth-user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'development-secret',
    });
  }

  /**
   * Whatever this method returns becomes `request.user`.
   */
  validate(payload: JwtPayload): AuthUser {
    return AuthUser.fromPayload(new JwtPayload(payload.sub, payload.email));
  }
}
