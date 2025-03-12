import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { KakaoApiService } from './kakao-api.service';

@Module({
  imports: [HttpModule],
  providers: [KakaoApiService],
  exports: [KakaoApiService],
})
export class KakaoApiModule {}
