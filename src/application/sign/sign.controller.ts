import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';
import * as qs from 'qs';

import { AuthService } from 'src/common/auth/auth.service';

import { SignService } from './sign.service';
import { SignInPageURLRequestBodyDTO, SignInPageURLRequestParamDTO } from './dto/sign-in-page-url-request.dto';
import { SignInPageURLResponseDTO } from './dto/sign-in-page-url-response.dto';
import { ServiceTokenResponseDTO } from './dto/service-token-response.dto';
import { ServiceTokenRequestDTO } from './dto/service-token-request.dto';
import { KakaoLoginCallbackRequestDTO } from './dto/kakao-login-callback-request.dto';

@ApiTags('인증')
@Controller('sign')
export class SignController {
  constructor(
    private readonly authService: AuthService,
    private readonly signService: SignService,
  ) {}

  @Post(':platform')
  @ApiOperation({ summary: '소셜 로그인 페이지 URL' })
  @ApiOkResponse({ type: SignInPageURLResponseDTO })
  getSignInPageURL(@Param() param: SignInPageURLRequestParamDTO, @Body() body: SignInPageURLRequestBodyDTO) {
    return this.signService.getSignInPageURL(param.platform, body.state);
  }

  // FIXME Redis
  @Get('kakao/callback')
  @ApiOperation({ summary: '카카오 로그인 Callback' })
  async kakaoLoginCallback(@Query() queryParam: KakaoLoginCallbackRequestDTO, @Res() response: Response) {
    const code = await this.signService.signInWithKakao(queryParam.code);
    const url = [queryParam.state, qs.stringify({ code })].join('?');

    response.redirect(HttpStatus.MOVED_PERMANENTLY, url);
  }

  // FIXME Redis
  @Post('token')
  @ApiOperation({ summary: '서비스 토큰 발급' })
  @ApiCreatedResponse({ type: ServiceTokenResponseDTO })
  async getToken(@Body() body: ServiceTokenRequestDTO) {
    return this.authService.getAuth(body.code);
  }
}
