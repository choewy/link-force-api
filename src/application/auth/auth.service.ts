import { Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { JwtConfigFactory } from 'src/common/config/providers/jwt-config.factory';

import { AuthToken } from './entities/auth-token.entity';
import { AccessTokenPayload, RefreshTokenPayload, VerifyAccessTokenResult } from './persistents/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtConfigFactory: JwtConfigFactory,
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: Repository<AuthToken>,
  ) {}

  public issueAccessToken(id: string, platformAccountId: string) {
    return this.jwtService.sign(
      { id, platformAccountId },
      {
        secret: this.jwtConfigFactory.getAccessTokenSecret(),
        expiresIn: '1h',
      },
    );
  }

  public issueRefreshToken(accessToken: string) {
    const segment = accessToken.split('.').pop();

    return this.jwtService.sign(
      { segment },
      {
        secret: this.jwtConfigFactory.getRefreshTokenSecret(),
        expiresIn: '1d',
      },
    );
  }

  public verifyAccessToken(accessToken: string, ignoreExpiration = false): VerifyAccessTokenResult {
    const verifyResult: VerifyAccessTokenResult = {
      id: null,
      platformAccountId: null,
      isExpired: ignoreExpiration,
    };

    try {
      const { id, platformAccountId } = this.jwtService.verify<AccessTokenPayload>(accessToken, {
        secret: this.jwtConfigFactory.getAccessTokenSecret(),
        ignoreExpiration,
      });

      verifyResult.id = id;
      verifyResult.platformAccountId = platformAccountId;
    } catch (e) {
      if (e.name === TokenExpiredError.name) {
        return this.verifyAccessToken(accessToken, true);
      }
    }

    return verifyResult;
  }

  public verifyRefreshToken(refreshToken: string, accessToken: string): boolean {
    try {
      const { segment } = this.jwtService.verify<RefreshTokenPayload>(refreshToken, {
        secret: this.jwtConfigFactory.getRefreshTokenSecret(),
      });

      return segment === accessToken.split('.').pop();
    } catch {
      return false;
    }
  }

  async setToken(accessToken: string, refreshToken: string): Promise<string> {
    const authToken = this.authTokenRepository.create({ accessToken, refreshToken });

    await this.authTokenRepository.insert(authToken);

    return authToken.id;
  }

  async getToken(authKey: string): Promise<AuthToken | null> {
    const authToken = await this.authTokenRepository.findOneBy({ id: authKey });

    await this.authTokenRepository.delete({ id: authKey });

    return authToken;
  }
}
