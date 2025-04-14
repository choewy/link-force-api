import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NaverApiConfigFactory {
  constructor(private readonly configService: ConfigService) {}

  public getClientID(): string {
    return this.configService.getOrThrow('NAVER_CLIENT_ID');
  }

  public getClientSecret(): string {
    return this.configService.getOrThrow('NAVER_CLIENT_SECRET');
  }

  public getLoginRedirectURI(): string {
    return this.configService.getOrThrow('NAVER_LOGIN_REDIRECT_URI');
  }

  public getConnectRedirectURI(): string {
    return this.configService.getOrThrow('NAVER_CONNECT_REDIRECT_URI');
  }
}
