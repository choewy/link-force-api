import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { OAuthService } from './oauth.service';
import { GetOAuthLoginUrlQueryDTO, GetOAuthLoginUrlParamDTO, GetOAuthLoginUrlResultDTO } from './dto/get-oauth-login-url.dto';
import { ProcessOAuthLoginCallbackParamDTO, ProcessOAuthLoginCallbackQueryDTO, ProcessOAuthLoginCallbackResultQueryDTO } from './dto/process-oauth-login-callback.dto';

@ApiTags('OAuth')
@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Get(':platform/login')
  @ApiOperation({ summary: '소셜 로그인 페이지 URL 조회' })
  @ApiOkResponse({ type: GetOAuthLoginUrlResultDTO })
  getLoginUrl(@Param() param: GetOAuthLoginUrlParamDTO, @Query() query: GetOAuthLoginUrlQueryDTO) {
    return this.oauthService.getLoginUrl(param.platform, query);
  }

  @Get(':platform/callback')
  @ApiOperation({ summary: '소셜 로그인 인증 콜백' })
  @ApiOkResponse({ type: ProcessOAuthLoginCallbackResultQueryDTO })
  processLoginCallback(@Param() param: ProcessOAuthLoginCallbackParamDTO, @Query() query: ProcessOAuthLoginCallbackQueryDTO) {
    return this.oauthService.processLoginCallback(param.platform, query);
  }
}
