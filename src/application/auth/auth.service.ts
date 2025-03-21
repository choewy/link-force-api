import { Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

import { v4 } from 'uuid';

import { JwtConfigFactory } from 'src/common/config/providers/jwt-config.factory';
import { RedisService } from 'src/common/redis/redis.service';

import { AccessTokenPayload, AuthToken, RefreshTokenPayload, VerifyAccessTokenResult } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfigFactory: JwtConfigFactory,
    private readonly redisService: RedisService,
  ) {}

  public issueAccessToken(id: string) {
    return this.jwtService.sign(
      { id },
      {
        secret: this.jwtConfigFactory.getAccessTokenSecret(),
        expiresIn: '1h',
      },
    );
  }

  public issueRefreshToken(accessToken: string) {
    const signature = accessToken.split('.').pop();

    return this.jwtService.sign(
      { signature },
      {
        secret: this.jwtConfigFactory.getRefreshTokenSecret(),
        expiresIn: '1d',
      },
    );
  }

  public verifyAccessToken(accessToken: string, ignoreExpiration = false): VerifyAccessTokenResult {
    const verifyResult: VerifyAccessTokenResult = {
      id: null,
      isExpired: ignoreExpiration,
    };

    try {
      const { id } = this.jwtService.verify<AccessTokenPayload>(accessToken, {
        secret: this.jwtConfigFactory.getAccessTokenSecret(),
        ignoreExpiration,
      });

      verifyResult.id = id;
    } catch (e) {
      if (e.name === TokenExpiredError.name) {
        return this.verifyAccessToken(accessToken, true);
      }
    }

    return verifyResult;
  }

  public verifyRefreshToken(refreshToken: string, accessToken: string): boolean {
    const { signature } = this.jwtService.verify<RefreshTokenPayload>(refreshToken, {
      secret: this.jwtConfigFactory.getRefreshTokenSecret(),
    });

    return signature === accessToken.split('.').pop();
  }

  private createTokenKey(authKey: string) {
    return ['jwt', authKey].join(':');
  }

  async setToken(accessToken: string, refreshToken: string): Promise<string> {
    const authKey = v4();
    const key = this.createTokenKey(authKey);

    await this.redisService.setValue<AuthToken>(key, { accessToken, refreshToken }, 180);

    return authKey;
  }

  async getToken(authKey: string): Promise<AuthToken | null> {
    const key = this.createTokenKey(authKey);
    const token = (await this.redisService.getValue<AuthToken>(key)) ?? null;

    await this.redisService.removeValue(key);

    return token;
  }
}
