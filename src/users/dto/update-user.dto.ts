import { IsString, MinLength, ValidateIf } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    id?: string; 

    @ValidateIf((o) => o.password !== undefined && o.password !== '')
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password?: string;
}
