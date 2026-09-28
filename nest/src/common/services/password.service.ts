import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * Encapsulates password hashing/comparison (SRP).
 * AuthService asks this class — it does not touch bcrypt directly.
 */
@Injectable()
export class PasswordService {
  private readonly saltRounds = 10;

  hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.saltRounds);
  }

  compare(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
