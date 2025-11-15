import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(['HOST', 'CLEANER'], {
    message: 'Role must be either HOST or CLEANER',
  })
  @IsNotEmpty()
  role: 'HOST' | 'CLEANER';

  @IsOptional()
  @IsString()
  phone?: string;
}
