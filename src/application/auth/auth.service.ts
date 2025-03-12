import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

import { DataSource } from 'typeorm';

import { JwtConfigFactory } from 'src/config/providers/jwt-config.factory';
import { KakaoApiService } from 'src/external/kakao-api/kakao-api.service';
import { KakaoAccount } from 'src/domain/entities/kakao-account.entity';
import { Auth } from 'src/domain/entities/auth.entity';
import { User } from 'src/domain/entities/user.entity';
import { UserSpecification } from 'src/domain/entities/user-specification.entity';

import { AccessTokenPayload, RefreshTokenPayload, VerifyAccessTokenResult } from './types';
import { ServiceTokenResponseDTO } from './dto/service-token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly jwtConfigFactory: JwtConfigFactory,
    private readonly kakaoApiService: KakaoApiService,
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

  private async saveAuth(accessToken: string, refreshToken: string): Promise<string> {
    const authRepository = this.dataSource.getRepository(Auth);
    const auth = authRepository.create({ accessToken, refreshToken });
    await authRepository.insert(auth);

    return auth.id;
  }

  async getToken(code: string) {
    const authRepository = this.dataSource.getRepository(Auth);
    const auth = await authRepository.findOneBy({ id: code });
    await authRepository.delete({ id: code });

    if (!auth) {
      throw new UnauthorizedException();
    }

    return new ServiceTokenResponseDTO(auth.accessToken, auth.refreshToken);
  }

  async signInWithKakao(code: string) {
    const tokenResponse = await this.kakaoApiService.getToken(code);
    const kakaoProfile = await this.kakaoApiService.getProfile(tokenResponse.access_token);

    const kakaoAccountRepository = this.dataSource.getRepository(KakaoAccount);

    let kakaoAccount = await kakaoAccountRepository.findOne({
      relations: { user: true },
      select: { id: true },
      where: { id: kakaoProfile.id },
    });

    if (!kakaoAccount?.user) {
      kakaoAccount = kakaoAccountRepository.create({
        id: kakaoProfile.id,
        nickname: kakaoProfile.properties.nickname,
        profileImage: kakaoProfile.properties.profile_image,
      });

      const userSpecificationRepository = this.dataSource.getRepository(UserSpecification);
      const userSpecification = userSpecificationRepository.create();
      const userRepository = this.dataSource.getRepository(User);
      const user = userRepository.create({ kakaoAccount, specification: userSpecification });
      await userRepository.insert(user);

      kakaoAccount.user = user;
    }

    const accessToken = this.issueAccessToken(kakaoAccount.user.id);
    const refreshToken = this.issueRefreshToken(accessToken);

    return this.saveAuth(accessToken, refreshToken);
  }
}
