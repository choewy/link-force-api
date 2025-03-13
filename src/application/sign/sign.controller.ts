import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';
import * as qs from 'qs';

import { AuthService } from 'src/common/auth/auth.service';
import { KakaoApiService } from 'src/external/kakao-api/kakao-api.service';

import { SignService } from './sign.service';
import { KakaoLoginCallbackRequestDTO } from './dto/kakao-login-callback-request.dto';
import { ServiceTokenResponseDTO } from './dto/service-token-response.dto';
import { ServiceTokenRequestDTO } from './dto/service-token-request.dto';
import { KakaoLoginPageRequestDTO } from './dto/kakao-login-page-request.dto';

@ApiTags('인증')
@Controller('sign')
export class SignController {
  constructor(
    private readonly kakaoApiService: KakaoApiService,
    private readonly authService: AuthService,
    private readonly signService: SignService,
  ) {}

  // FIXME
  @Get('kakao')
  @ApiOperation({ summary: '카카오 로그인 페이지 진입' })
  getKakaoLoginPageURL(@Query() query: KakaoLoginPageRequestDTO, @Res() response: Response): void {
    const url = this.kakaoApiService.getLoginPageURL(query.state);

    response.redirect(HttpStatus.MOVED_PERMANENTLY, url);
  }

  // FIXME
  @Get('kakao/callback')
  @ApiOperation({ summary: '카카오 로그인 Callback' })
  async kakaoLoginCallback(@Query() queryParam: KakaoLoginCallbackRequestDTO, @Res() response: Response) {
    const code = await this.signService.signInWithKakao(queryParam.code);
    const url = [queryParam.state, qs.stringify({ code })].join('?');

    response.redirect(HttpStatus.MOVED_PERMANENTLY, url);
  }

  // FIXME
  @Post('token')
  @ApiOperation({ summary: '서비스 토큰 발급' })
  @ApiCreatedResponse({ type: ServiceTokenResponseDTO })
  async getToken(@Body() body: ServiceTokenRequestDTO) {
    return this.authService.getAuth(body.code);
  }
}
