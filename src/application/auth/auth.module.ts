import { Module } from '@nestjs/common';

import { KakaoApiModule } from 'src/external/kakao-api/kakao-api.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule, KakaoApiModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
