import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { KakaoApiModule } from 'src/external/kakao-api/kakao-api.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [JwtModule, KakaoApiModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
