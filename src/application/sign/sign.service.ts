import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as qs from 'qs';

import { AuthService } from 'src/application/auth/auth.service';
import { PlatformAccount } from 'src/domain/entities/platform-account.entity';
import { UserSpecification } from 'src/domain/entities/user-specification.entity';
import { User } from 'src/domain/entities/user.entity';
import { KakaoApiService } from 'src/external/kakao-api/kakao-api.service';
import { KakaoProfileResponse } from 'src/external/kakao-api/types';
import { NaverApiService } from 'src/external/naver-api/naver-api.service';
import { NaverProfileResponse } from 'src/external/naver-api/types';

import { SignPlatform } from './enums';
import { GetOrCreatePlatformAccountParam } from './types';
import { SignInPageURLResponseDTO } from './dto/sign-in-page-url-response.dto';
import { SignTokenResponseDTO } from './dto/sign-token-response.dto';
import { SignWithPlatformRequestQueryParamDTO } from './dto/sign-with-platform-request.dto';

@Injectable()
export class SignService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PlatformAccount)
    private readonly platformAccountRepository: Repository<PlatformAccount>,
    private readonly authService: AuthService,
    private readonly kakaoApiService: KakaoApiService,
    private readonly naverApiService: NaverApiService,
  ) {}

  async getSignToken(authKey: string): Promise<SignTokenResponseDTO> {
    const tokens = await this.authService.getToken(authKey);

    if (!tokens) {
      throw new UnauthorizedException();
    }

    return new SignTokenResponseDTO(tokens.accessToken, tokens.refreshToken);
  }

  public getSignInPageURL(platform: SignPlatform, state: string): SignInPageURLResponseDTO {
    switch (platform) {
      case SignPlatform.Kakao:
        return new SignInPageURLResponseDTO(this.kakaoApiService.getLoginPageURL(state));

      case SignPlatform.Naver:
        return new SignInPageURLResponseDTO(this.naverApiService.getLoginPageURL(state));

      default:
        throw new BadRequestException();
    }
  }

  private async createSignUrl(id: string, platform: SignPlatform, redirectUrl: string): Promise<string> {
    const accessToken = this.authService.issueAccessToken(id);
    const refreshToken = this.authService.issueRefreshToken(accessToken);

    const authKey = await this.authService.setToken(accessToken, refreshToken);

    return [redirectUrl, qs.stringify({ platform, authKey })].join('?');
  }

  private async getPlatformAccessToken(platform: SignPlatform, code: string, state: string): Promise<string> {
    switch (platform) {
      case SignPlatform.Kakao:
        return (await this.kakaoApiService.getToken(code)).access_token;

      case SignPlatform.Naver:
        return (await this.naverApiService.getToken(code, state)).access_token;

      default:
        throw new BadRequestException();
    }
  }

  private async getPlatformProfile(platform: SignPlatform, accessToken: string): Promise<GetOrCreatePlatformAccountParam> {
    let platformProfile: KakaoProfileResponse | NaverProfileResponse | null = null;

    switch (platform) {
      case SignPlatform.Kakao:
        platformProfile = await this.kakaoApiService.getProfile(accessToken);

        return {
          platform,
          accountId: platformProfile.id,
          nickname: platformProfile.properties.nickname,
          profileImage: platformProfile.properties.profile_image,
        };

      case SignPlatform.Naver:
        platformProfile = await this.naverApiService.getProfile(accessToken);

        return {
          platform,
          accountId: platformProfile.response.id,
          nickname: platformProfile.response.nickname,
          profileImage: platformProfile.response.profile_image,
          name: platformProfile.response.name,
          email: platformProfile.response.email,
        };

      default:
        throw new BadRequestException();
    }
  }

  private async findOrCreatePlatformAccount(param: GetOrCreatePlatformAccountParam): Promise<PlatformAccount> {
    let platformAccount = await this.platformAccountRepository.findOne({
      relations: { user: true },
      select: { id: true },
      where: { platform: param.platform, accountId: param.accountId },
    });

    if (platformAccount?.user?.id) {
      platformAccount.nickname = param.nickname ?? null;
      platformAccount.email = param.email ?? null;
      platformAccount.name = param.name ?? null;
      platformAccount.profileImage = param.profileImage ?? null;

      await this.platformAccountRepository.update({ id: platformAccount.id }, platformAccount);

      return platformAccount;
    }

    platformAccount = this.platformAccountRepository.create(param);
    platformAccount.user = await this.userRepository.save({ platformAccount, specification: new UserSpecification() });

    return platformAccount;
  }

  async signWithPlatform(platform: SignPlatform, param: SignWithPlatformRequestQueryParamDTO): Promise<string> {
    const accessToken = await this.getPlatformAccessToken(platform, param.code, param.state);
    const platformProfile = await this.getPlatformProfile(platform, accessToken);
    const platformAccount = await this.findOrCreatePlatformAccount(platformProfile);

    return this.createSignUrl(platformAccount.user.id, platform, param.state);
  }
}
