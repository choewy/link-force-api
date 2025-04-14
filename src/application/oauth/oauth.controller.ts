import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { OAuthService } from './oauth.service';
import { GetOAuthLoginUrlBodyDTO, GetOAuthLoginUrlParamDTO, GetOAuthLoginUrlResultDTO } from './dto/get-oauth-login-url.dto';
import { ProcessOAuthLoginCallbackParamDTO, ProcessOAuthLoginCallbackQueryDTO, ProcessOAuthLoginCallbackResultQueryDTO } from './dto/process-oauth-login-callback.dto';
import { GetOAuthConnectUrlBodyDTO, GetOAuthConnectUrlParamDTO } from './dto/get-oauth-connect-url.dto';

@ApiTags('OAuth')
@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Post(':platform/login')
  @ApiOperation({ summary: '소셜 로그인 페이지 URL 조회' })
  @ApiOkResponse({ type: GetOAuthLoginUrlResultDTO })
  getLoginUrl(@Param() param: GetOAuthLoginUrlParamDTO, @Body() body: GetOAuthLoginUrlBodyDTO) {
    return this.oauthService.getLoginUrl(param.platform, body);
  }

  @Get(':platform/login')
  @ApiOperation({ summary: '소셜 로그인 인증 콜백' })
  @ApiOkResponse({ type: ProcessOAuthLoginCallbackResultQueryDTO })
  async processLoginCallback(@Res() res: Response, @Param() param: ProcessOAuthLoginCallbackParamDTO, @Query() query: ProcessOAuthLoginCallbackQueryDTO) {
    res.redirect(HttpStatus.PERMANENT_REDIRECT, await this.oauthService.processLoginCallback(param.platform, query));
  }

  @Post(':platform/connect')
  @ApiOperation({ summary: '소셜 로그인 페이지 URL 조회(계정 추가 연결)' })
  @ApiOkResponse({ type: GetOAuthLoginUrlResultDTO })
  getConnectUrl(@Param() param: GetOAuthConnectUrlParamDTO, @Body() body: GetOAuthConnectUrlBodyDTO) {
    return this.oauthService.getConnectUrl(param.platform, body);
  }

  @Get(':platform/connect')
  processConnectCallback() {
    return;
  }
}
