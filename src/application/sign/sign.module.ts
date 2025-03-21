import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from 'src/domain/entities/user.entity';
import { PlatformAccount } from 'src/domain/entities/platform-account.entity';
import { KakaoApiModule } from 'src/external/kakao-api/kakao-api.module';
import { NaverApiModule } from 'src/external/naver-api/naver-api.module';

import { AuthModule } from '../auth/auth.module';

import { SignController } from './sign.controller';
import { SignService } from './sign.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, PlatformAccount]), AuthModule, KakaoApiModule, NaverApiModule],
  controllers: [SignController],
  providers: [SignService],
})
export class SignModule {}
