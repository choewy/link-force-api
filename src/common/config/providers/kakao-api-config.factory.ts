import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KakaoApiConfigFactory {
  constructor(private readonly configService: ConfigService) {}

  public getClientID(): string {
    return this.configService.getOrThrow('KAKAO_CLIENT_ID');
  }

  public getClientSecret(): string {
    return this.configService.getOrThrow('KAKAO_CLIENT_SECRET');
  }

  public getLoginRedirectURI(): string {
    return this.configService.getOrThrow('KAKAO_REDIRECT_URI');
  }
}
