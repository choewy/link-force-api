import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigFactory {
  constructor(private readonly configService: ConfigService) {}

  public getAccessTokenSecret(): string {
    return this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET');
  }

  public getRefreshTokenSecret(): string {
    return this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET');
  }
}
