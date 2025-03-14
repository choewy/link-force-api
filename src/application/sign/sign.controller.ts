import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';
import * as qs from 'qs';

import { SignService } from './sign.service';
import { SignInPageURLRequestBodyDTO, SignInPageURLRequestParamDTO } from './dto/sign-in-page-url-request.dto';
import { SignInPageURLResponseDTO } from './dto/sign-in-page-url-response.dto';
import { SignTokenResponseDTO } from './dto/sign-token-response.dto';
import { SignTokenRequestDTO } from './dto/sign-token-request.dto';
import { SignWithKakaoRequestDTO } from './dto/sign-with-kakao-request.dto';

@ApiTags('인증')
@Controller('sign')
export class SignController {
  constructor(private readonly signService: SignService) {}

  @Post(':platform/login')
  @ApiOperation({ summary: '소셜 로그인 페이지 URL' })
  @ApiOkResponse({ type: SignInPageURLResponseDTO })
  getSignInPageURL(@Param() param: SignInPageURLRequestParamDTO, @Body() body: SignInPageURLRequestBodyDTO) {
    return this.signService.getSignInPageURL(param.platform, body.state);
  }

  @Get('kakao')
  @ApiOperation({ summary: '카카오 계정으로 인증' })
  async signWithKakao(@Query() queryParam: SignWithKakaoRequestDTO, @Res() response: Response) {
    const code = await this.signService.signWithKakao(queryParam.code);
    const url = [queryParam.state, qs.stringify({ code })].join('?');

    response.redirect(HttpStatus.MOVED_PERMANENTLY, url);
  }

  @Post('token')
  @ApiOperation({ summary: '인증 토큰 발급' })
  @ApiCreatedResponse({ type: SignTokenResponseDTO })
  async getSignToken(@Body() body: SignTokenRequestDTO) {
    return this.signService.getSignToken(body.id);
  }
}
