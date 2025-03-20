import { Module } from '@nestjs/common';

import { KakaoApiModule } from 'src/external/kakao-api/kakao-api.module';
import { NaverApiModule } from 'src/external/naver-api/naver-api.module';

import { SignController } from './sign.controller';
import { SignService } from './sign.service';

@Module({
  imports: [KakaoApiModule, NaverApiModule],
  controllers: [SignController],
  providers: [SignService],
})
export class SignModule {}
