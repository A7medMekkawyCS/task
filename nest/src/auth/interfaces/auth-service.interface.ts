import { LoginDto } from '../dto/login.dto';
import { SignupDto } from '../dto/signup.dto';
import { UserPublic } from '../../users/entities/user-public.entity';

/**
 * Interface (abstraction) that AuthService implements.
 * Controllers depend on the contract, not the concrete class details.
 */
export interface IAuthService {
  signup(dto: SignupDto): Promise<UserPublic>;
  login(dto: LoginDto): Promise<UserPublic>;
}

export const AUTH_SERVICE = Symbol('AUTH_SERVICE');
