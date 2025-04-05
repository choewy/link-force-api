import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { KakaoPayApiService } from './kakao-pay-api.service';

@Module({
  imports: [HttpModule],
  providers: [KakaoPayApiService],
  exports: [KakaoPayApiService],
})
export class KakaoPayApiModule {}
