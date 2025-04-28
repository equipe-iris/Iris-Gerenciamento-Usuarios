import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ValidateUserDto } from './dto/validate-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate')
  @ApiOperation({ summary: 'Validate user credentials' })
  @ApiBody({ type: ValidateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Credentials valid',
    schema: { example: { id: '550e8400-e29b-41d4-a716-446655440000', role: 'ADMIN', name: 'Pedro Alvis' } },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  validate(@Body() dto: ValidateUserDto) {
    return this.authService.validateCredentials(dto);
  }
}
