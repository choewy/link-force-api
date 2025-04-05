import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleApiConfigFactory {
  constructor(private readonly configService: ConfigService) {}

  public getClientID(): string {
    return this.configService.getOrThrow('GOOGLE_CLIENT_ID');
  }

  public getClientSecret(): string {
    return this.configService.getOrThrow('GOOGLE_CLIENT_SECRET');
  }

  public getLoginRedirectURI(): string {
    return this.configService.getOrThrow('GOOGLE_LOGIN_REDIRECT_URI');
  }
}
