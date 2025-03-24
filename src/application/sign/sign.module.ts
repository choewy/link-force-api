import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KakaoApiModule } from 'src/external/kakao-api/kakao-api.module';
import { NaverApiModule } from 'src/external/naver-api/naver-api.module';
import { GoogleApiModule } from 'src/external/google-api/google-api.module';
import { PlatformAccount } from 'src/application/user/entities/platform-account.entity';

import { User } from '../user/entities/user.entity';
import { UserSpecification } from '../user/entities/user-specification.entity';
import { AuthModule } from '../auth/auth.module';

import { SignController } from './sign.controller';
import { SignService } from './sign.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSpecification, PlatformAccount]), AuthModule, KakaoApiModule, NaverApiModule, GoogleApiModule],
  controllers: [SignController],
  providers: [SignService],
})
export class SignModule {}
