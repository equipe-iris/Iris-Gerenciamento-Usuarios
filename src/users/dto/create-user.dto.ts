import {
    IsString,
    IsEmail,
    IsEnum,
  } from 'class-validator';
  import { UserRole } from '../entities/user.entity';
  
  export class CreateUserDto {
    @IsString()
    nome: string;
  
    @IsEnum(UserRole)
    role: UserRole;
  
    @IsEmail()
    email: string;
  }
  