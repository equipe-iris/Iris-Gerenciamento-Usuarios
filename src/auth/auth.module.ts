import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/users/entities/user.entity';
import { SharedModule } from 'src/common/shared.module';

@Module({
    imports: [
      TypeOrmModule.forFeature([User]),
      SharedModule,
    ],
    providers: [AuthService],
    controllers: [AuthController],
  })
  export class AuthModule {}
  