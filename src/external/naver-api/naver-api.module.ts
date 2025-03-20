import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { NaverApiService } from './naver-api.service';

@Module({
  imports: [HttpModule],
  providers: [NaverApiService],
  exports: [NaverApiService],
})
export class NaverApiModule {}
