import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsEmail({}, { message: 'EMAIL_INVALID' })
  @IsNotEmpty({ message: 'EMAIL_REQUIRED' })
  email: string;

  @MinLength(6, { message: 'PASSWORD_MIN' })
  @IsString({ message: 'PASSWORD_STRING' })
  @IsNotEmpty({ message: 'PASSWORD_REQUIRED' })
  password: string;
}
