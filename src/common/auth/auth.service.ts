import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

import { DataSource } from 'typeorm';

import { JwtConfigFactory } from 'src/common/config/providers/jwt-config.factory';
import { Auth } from 'src/domain/entities/auth.entity';

import { AccessTokenPayload, RefreshTokenPayload, VerifyAccessTokenResult } from './types';
import { AuthDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly jwtConfigFactory: JwtConfigFactory,
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

  async saveAuth(accessToken: string, refreshToken: string): Promise<AuthDTO> {
    const authRepository = this.dataSource.getRepository(Auth);
    const auth = authRepository.create({ accessToken, refreshToken });
    await authRepository.insert(auth);

    return new AuthDTO(auth);
  }

  async getAuth(code: string): Promise<AuthDTO> {
    const authRepository = this.dataSource.getRepository(Auth);
    const auth = await authRepository.findOneBy({ id: code });
    await authRepository.delete({ id: code });

    if (!auth) {
      throw new UnauthorizedException();
    }

    return new AuthDTO(auth);
  }
}
