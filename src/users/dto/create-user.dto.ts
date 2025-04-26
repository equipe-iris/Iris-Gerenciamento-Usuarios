import { IsString, IsEmail, IsEnum, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';
  
  export class CreateUserDto {
    @IsString()
    nome: string;
  
    @IsEnum(UserRole)
    role: UserRole;
  
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;
  }
