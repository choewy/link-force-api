import { Module } from '@nestjs/common';

import { KakaoApiModule } from 'src/external/kakao-api/kakao-api.module';

import { SignController } from './sign.controller';
import { SignService } from './sign.service';

@Module({
  imports: [KakaoApiModule],
  controllers: [SignController],
  providers: [SignService],
})
export class SignModule {}
