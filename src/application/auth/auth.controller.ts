import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';
import * as qs from 'qs';

import { KakaoApiService } from 'src/external/kakao-api/kakao-api.service';

import { AuthService } from './auth.service';
import { KakaoLoginCallbackRequestDTO } from './dto/kakao-login-callback-request.dto';
import { KakaoLoginPageRequestDTO } from './dto/kakao-login-page-request.dto';
import { ServiceTokenRequestDTO } from './dto/service-token-request.dto';
import { ServiceTokenResponseDTO } from './dto/service-token-response.dto';

@ApiTags('인증/인가')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly kakaoApiService: KakaoApiService,
  ) {}

  @Get('kakao')
  @ApiOperation({ summary: '카카오 로그인 페이지 진입' })
  getKakaoLoginPageURL(@Query() query: KakaoLoginPageRequestDTO, @Res() response: Response): void {
    const url = this.kakaoApiService.getLoginPageURL(query.state);

    response.redirect(HttpStatus.MOVED_PERMANENTLY, url);
  }

  @Get('kakao/callback')
  @ApiOperation({ summary: '카카오 로그인 Callback', deprecated: true })
  async kakaoLoginCallback(@Query() queryParam: KakaoLoginCallbackRequestDTO, @Res() response: Response) {
    const code = await this.authService.signInWithKakao(queryParam.code);
    const url = [queryParam.state, qs.stringify({ code })].join('?');

    response.redirect(HttpStatus.MOVED_PERMANENTLY, url);
  }

  @Post('token')
  @ApiOperation({ summary: '서비스 토큰 발급' })
  @ApiCreatedResponse({ type: ServiceTokenResponseDTO })
  async getToken(@Body() body: ServiceTokenRequestDTO) {
    return this.authService.getToken(body.code);
  }
}
