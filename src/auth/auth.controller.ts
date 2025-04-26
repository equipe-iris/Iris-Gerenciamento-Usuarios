import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login with email and password' })
  @ApiBody({
    schema: {
      example: {
        email: 'user@example.com',
        password: 'strongPassword123',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'JWT token',
    schema: {
      example: { access_token: 'eyJhbGciOiJIUzI1NiI...' },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
