import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KakaoApiModule } from 'src/external/kakao-api/kakao-api.module';
import { NaverApiModule } from 'src/external/naver-api/naver-api.module';
import { GoogleApiModule } from 'src/external/google-api/google-api.module';

import { User } from '../user/entities/user.entity';
import { Link } from '../link/entities/link.entity';
import { AuthModule } from '../auth/auth.module';

import { OAuth } from './entities/oauth.entity';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';

@Module({
  imports: [TypeOrmModule.forFeature([OAuth, User, Link]), AuthModule, KakaoApiModule, NaverApiModule, GoogleApiModule],
  controllers: [OAuthController],
  providers: [OAuthService],
  exports: [OAuthService],
})
export class OAuthModule {}
