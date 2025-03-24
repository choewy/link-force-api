import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';

import { User } from './entities/user.entity';
import { PlatformAccount } from './entities/platform-account.entity';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, PlatformAccount]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
