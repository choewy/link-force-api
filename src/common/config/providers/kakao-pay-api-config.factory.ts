import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KakaoPayApiConfigFactory {
  constructor(private readonly configService: ConfigService) {}

  public getClientID(): string {
    return this.configService.getOrThrow('KAKAO_PAY_CLIENT_ID');
  }

  public getClientSecret(): string {
    return this.configService.getOrThrow('KAKAO_PAY_CLIENT_SECRET');
  }

  public getSecretKey(): string {
    return this.configService.getOrThrow('KAKAO_PAY_SECRET_KEY');
  }

  public getLoginRedirectURI(): string {
    return this.configService.getOrThrow('KAKAO_PAY_LOGIN_REDIRECT_URI');
  }
}
