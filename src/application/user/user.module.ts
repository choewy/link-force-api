import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { OAuth } from '../oauth/entities/oauth.entity';

import { User } from './entities/user.entity';

import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, OAuth]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
