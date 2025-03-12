import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { KakaoApiService } from 'src/external/kakao-api/kakao-api.service';

import { KakaoLoginCallbackRequestDTO } from './dto/kakao-login-callback-request.dto';

@ApiTags('인증/인가')
@Controller('auth')
export class AuthController {
  constructor(private readonly kakaoApiService: KakaoApiService) {}

  @Get('kakao')
  @ApiOperation({ summary: '카카오 로그인 페이지 진입' })
  getKakaoLoginPageURL(@Res() response: Response): void {
    response.redirect(HttpStatus.MOVED_PERMANENTLY, this.kakaoApiService.getLoginPageURL());
  }

  @Get('kakao/callback')
  @ApiOperation({ summary: '카카오 로그인 Callback', deprecated: true })
  async kakaoLoginCallback(@Query() queryParam: KakaoLoginCallbackRequestDTO) {
    const tokenResponse = await this.kakaoApiService.getToken(queryParam.code);
    const userProfile = await this.kakaoApiService.getUserProfile(tokenResponse.access_token);

    // TODO 카카오로 서비스 로그인 구현

    return userProfile;
  }
}
