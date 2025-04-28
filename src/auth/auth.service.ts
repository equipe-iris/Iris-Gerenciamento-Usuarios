import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { HashingService } from 'src/common/services/hashing.service';
import { ValidateUserDto } from './dto/validate-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private hashing: HashingService,
  ) {}

  async validateCredentials(dto: ValidateUserDto): Promise<{ id: string; role: string, name: string }> {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user || !(await this.hashing.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { id: user.id, role: user.role, name: user.name };
  }
}
