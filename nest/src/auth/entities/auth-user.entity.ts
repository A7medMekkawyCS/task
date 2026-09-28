/**
 * JWT payload shape as a class (value object).
 */
export class JwtPayload {
  constructor(
    public readonly sub: string,
    public readonly email: string,
  ) {}
}

/**
 * Authenticated user attached to request.user after JwtStrategy.validate().
 * Profile uses same field names as UserPublic (id + email).
 */
export class AuthUser {
  constructor(
    public readonly id: string,
    public readonly email: string,
  ) {}

  static fromPayload(payload: JwtPayload): AuthUser {
    return new AuthUser(payload.sub, payload.email);
  }
}
