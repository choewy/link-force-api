import { Injectable, UnauthorizedException } from '@nestjs/common';

import { DataSource } from 'typeorm';
import * as qs from 'qs';

import { AuthService } from 'src/common/auth/auth.service';
import { PlatformAccount } from 'src/domain/entities/platform-account.entity';
import { KakaoApiService } from 'src/external/kakao-api/kakao-api.service';
import { UserSpecification } from 'src/domain/entities/user-specification.entity';
import { User } from 'src/domain/entities/user.entity';

import { SignPlatform } from './enums';
import { SignInPageURLResponseDTO } from './dto/sign-in-page-url-response.dto';
import { SignTokenResponseDTO } from './dto/sign-token-response.dto';
import { SignWithKakaoRequestDTO } from './dto/sign-with-kakao-request.dto';

@Injectable()
export class SignService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly authService: AuthService,
    private readonly kakaoApiService: KakaoApiService,
  ) {}

  public getSignInPageURL(platform: SignPlatform, state: string) {
    let url = '';

    switch (platform) {
      case SignPlatform.Kakao:
        url = this.kakaoApiService.getLoginPageURL(state);
        break;
    }

    return new SignInPageURLResponseDTO(url);
  }

  private async findOrCreatePlatformAccount(platform: SignPlatform, accountId: string, nickname?: string | null, profileImage?: string | null): Promise<PlatformAccount> {
    const platformAccountRepository = this.dataSource.getRepository(PlatformAccount);

    let platformAccount = await platformAccountRepository.findOne({
      relations: { user: true },
      select: { id: true },
      where: { platform, accountId },
    });

    if (platformAccount?.user?.id) {
      await platformAccountRepository.update({ id: platformAccount.id }, { nickname, profileImage });

      return platformAccount;
    }

    platformAccount = platformAccountRepository.create({ platform, accountId, nickname, profileImage });

    const userSpecificationRepository = this.dataSource.getRepository(UserSpecification);
    const userRepository = this.dataSource.getRepository(User);
    const user = userRepository.create({ platformAccount, specification: userSpecificationRepository.create() });
    await userRepository.save(user);

    platformAccount.user = user;

    return platformAccount;
  }

  private async createSignUrl(id: string, redirectUrl: string) {
    const accessToken = this.authService.issueAccessToken(id);
    const refreshToken = this.authService.issueRefreshToken(accessToken);

    const authKey = await this.authService.setToken(accessToken, refreshToken);

    return [redirectUrl, qs.stringify({ authKey })].join('?');
  }

  async signWithKakao(param: SignWithKakaoRequestDTO) {
    const tokenResponse = await this.kakaoApiService.getToken(param.code);
    const kakaoProfile = await this.kakaoApiService.getProfile(tokenResponse.access_token);

    const platformAccount = await this.findOrCreatePlatformAccount(SignPlatform.Kakao, kakaoProfile.id, kakaoProfile.properties.nickname, kakaoProfile.properties.profile_image);

    return this.createSignUrl(platformAccount.user.id, param.state);
  }

  async getSignToken(authKey: string) {
    const tokens = await this.authService.getToken(authKey);

    if (!tokens) {
      throw new UnauthorizedException();
    }

    return new SignTokenResponseDTO(tokens.accessToken, tokens.refreshToken);
  }
}
