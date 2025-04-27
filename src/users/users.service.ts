import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashingService } from '../common/services/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly hashingService: HashingService,
  ) { }

  async create(dto: CreateUserDto): Promise<User> {
    const hashed = await this.hashingService.hash(dto.password);
    const user = this.userRepo.create({ ...dto, password: hashed });
    try {
      return await this.userRepo.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError && (error as any).code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    if (dto.password !== undefined && dto.password.trim() === '') {
      delete dto.password;
    }
    if (dto.password) {
      dto.password = await this.hashingService.hash(dto.password);
    }
    delete dto.id;
    await this.userRepo.update(id, dto);
    return this.findOne(id);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  findAll(): Promise<Partial<User>[]> {
    return this.userRepo.find({
      select: ['id', 'name', 'role', 'email'],
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
        throw new NotFoundException('User not found');
    }
    return { message: 'User successfully removed' };
}
}
