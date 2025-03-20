import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiMovedPermanentlyResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { SignService } from './sign.service';
import { SignInPageURLResponseDTO } from './dto/sign-in-page-url-response.dto';
import { SignTokenResponseDTO } from './dto/sign-token-response.dto';
import { SignTokenRequestDTO } from './dto/sign-token-request.dto';
import { SignWithPlatformResponseDTO } from './dto/sign-with-platform-response.dto';
import { SignWithPlatformRequestBodyDTO, SignWithPlatformRequestParamDTO, SignWithPlatformRequestQueryParamDTO } from './dto/sign-with-platform-request.dto';

@ApiTags('인증')
@Controller('sign')
export class SignController {
  constructor(private readonly signService: SignService) {}

  @Post('token')
  @ApiOperation({ summary: '인증 토큰 발급' })
  @ApiCreatedResponse({ type: SignTokenResponseDTO })
  async getSignToken(@Body() body: SignTokenRequestDTO) {
    return this.signService.getSignToken(body.authKey);
  }

  @Post(':platform/login')
  @ApiOperation({ summary: '소셜 로그인 페이지 URL' })
  @ApiOkResponse({ type: SignInPageURLResponseDTO })
  getSignInPageURL(@Param() param: SignWithPlatformRequestParamDTO, @Body() body: SignWithPlatformRequestBodyDTO) {
    return this.signService.getSignInPageURL(param.platform, body.state);
  }

  @Get(':platform/result')
  @ApiOperation({ summary: '소셜 로그인 인증 콜백' })
  @ApiMovedPermanentlyResponse({ type: SignWithPlatformResponseDTO })
  async signWithPlatform(@Param() param: SignWithPlatformRequestParamDTO, @Query() queryParam: SignWithPlatformRequestQueryParamDTO, @Res() response: Response) {
    response.redirect(HttpStatus.MOVED_PERMANENTLY, await this.signService.signWithPlatform(param.platform, queryParam));
  }
}
