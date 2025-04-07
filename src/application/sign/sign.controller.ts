import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { ApiCreatedResponse, ApiMovedPermanentlyResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { SignService } from './sign.service';
import { GetSignTokenDTO } from './dto/get-sign-token.dto';
import { GetSignTokenResultDTO } from './dto/get-sign-token-result.dto';
import { GetPlatformLoginPageUrlDTO } from './dto/get-platform-login-page-url.dto';
import { GetPlatformLoginPageUrlResultDTO } from './dto/get-platform-login-page-url-result.dto';
import { PlatformParamDTO } from './dto/platform-param.dto';
import { PlatformLoginCallbackQueryDTO } from './dto/platform-login-callback-query.dto';
import { PlatformLoginCallbackResultDTO } from './dto/platform-login-callback-result.dto';
import { RefreshSignTokenBodyDTO, RefreshSignTokenResultDTO } from './dto/refresh-sign-token.dto';

@ApiTags('인증')
@Controller('sign')
export class SignController {
  constructor(private readonly signService: SignService) {}

  @Post('token')
  @ApiOperation({ summary: '인증 토큰 발급' })
  @ApiCreatedResponse({ type: GetSignTokenResultDTO })
  async getSignToken(@Body() getSignTokenDTO: GetSignTokenDTO) {
    return this.signService.getSignToken(getSignTokenDTO);
  }

  @Post('token/refresh')
  @ApiOperation({ summary: '인증 토큰 갱신' })
  @ApiCreatedResponse({ type: RefreshSignTokenResultDTO })
  refreshSignToken(@Body() refreshSignTokenDTO: RefreshSignTokenBodyDTO) {
    return this.signService.refreshSignToken(refreshSignTokenDTO);
  }

  @Post(':platform/login')
  @ApiOperation({ summary: '소셜 로그인 페이지 URL' })
  @ApiOkResponse({ type: GetPlatformLoginPageUrlResultDTO })
  getPlatformLoginPageUrl(@Param() param: PlatformParamDTO, @Body() body: GetPlatformLoginPageUrlDTO) {
    return this.signService.getPlatformLoginPageUrl(param.platform, body.state);
  }

  @Get(':platform/result')
  @ApiOperation({ summary: '소셜 로그인 인증 콜백' })
  @ApiMovedPermanentlyResponse({ type: PlatformLoginCallbackResultDTO })
  async platformLoginCallback(@Param() param: PlatformParamDTO, @Query() queryParam: PlatformLoginCallbackQueryDTO, @Res() response: Response) {
    response.redirect(HttpStatus.MOVED_PERMANENTLY, await this.signService.platformLoginCallback(param.platform, queryParam));
  }
}
