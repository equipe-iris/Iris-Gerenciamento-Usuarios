import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { HashingService } from '../common/services/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await this.hashingService.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(dto.email, dto.password);
    const payload = { sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
