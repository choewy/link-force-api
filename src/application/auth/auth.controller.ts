import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { GetAuthTokenBodyDTO, GetAuthTokenResultDTO } from './dto/get-auth-token.dto';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  @ApiOperation({ summary: '인증 토큰 발급' })
  @ApiCreatedResponse({ type: GetAuthTokenResultDTO })
  async getAuthToken(@Body() body: GetAuthTokenBodyDTO) {
    return this.authService.getAuthToken(body.authKey);
  }
}
