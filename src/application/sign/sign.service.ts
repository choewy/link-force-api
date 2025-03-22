import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as qs from 'qs';

import { AuthService } from 'src/application/auth/auth.service';
import { PlatformAccount } from 'src/application/user/entities/platform-account.entity';
import { KakaoApiService } from 'src/external/kakao-api/kakao-api.service';
import { NaverApiService } from 'src/external/naver-api/naver-api.service';

import { SignPlatform } from '../user/persistents/enums';
import { User } from '../user/entities/user.entity';
import { UserSpecification } from '../user/entities/user-specification.entity';

import { PlatformProfile } from './persistents/platform-profile';
import { GetSignTokenDTO } from './dto/get-sign-token.dto';
import { GetSignTokenResultDTO } from './dto/get-sign-token-result.dto';
import { GetPlatformLoginPageUrlResultDTO } from './dto/get-platform-login-page-url-result.dto';
import { PlatformLoginCallbackQueryDTO } from './dto/platform-login-callback-query.dto';

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

  async getSignToken(getSignTokenDTO: GetSignTokenDTO): Promise<GetSignTokenResultDTO> {
    const tokens = await this.authService.getToken(getSignTokenDTO.authKey);

    if (!tokens) {
      throw new UnauthorizedException();
    }

    return new GetSignTokenResultDTO(tokens.accessToken, tokens.refreshToken);
  }

  public getPlatformLoginPageUrl(platform: SignPlatform, state: string): GetPlatformLoginPageUrlResultDTO {
    switch (platform) {
      case SignPlatform.Kakao:
        return new GetPlatformLoginPageUrlResultDTO(this.kakaoApiService.getLoginPageURL(state));

      case SignPlatform.Naver:
        return new GetPlatformLoginPageUrlResultDTO(this.naverApiService.getLoginPageURL(state));

      default:
        throw new BadRequestException();
    }
  }

  private async createSignUrl(redirectUrl: string, platform: SignPlatform, id: string): Promise<string> {
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

  private async getPlatformProfile(platform: SignPlatform, accessToken: string): Promise<PlatformProfile> {
    switch (platform) {
      case SignPlatform.Kakao:
        return PlatformProfile.fromKakaoProfile(await this.kakaoApiService.getProfile(accessToken));

      case SignPlatform.Naver:
        return PlatformProfile.fromNaverProfile(await this.naverApiService.getProfile(accessToken));

      default:
        throw new BadRequestException();
    }
  }

  private async findOrCreatePlatformAccount(platformProfile: PlatformProfile): Promise<PlatformAccount> {
    let platformAccount = await this.platformAccountRepository.findOne({
      relations: { user: true },
      select: { id: true },
      where: { platform: platformProfile.platform, accountId: platformProfile.accountId },
    });

    if (platformAccount?.user?.id) {
      platformAccount.nickname = platformProfile.nickname;
      platformAccount.name = platformProfile.name;
      platformAccount.email = platformProfile.email;
      platformAccount.profileImage = platformProfile.profileImage;

      await this.platformAccountRepository.update({ id: platformAccount.id }, platformAccount);

      return platformAccount;
    }

    platformAccount = this.platformAccountRepository.create(platformProfile);
    platformAccount.user = await this.userRepository.save({ platformAccount, specification: new UserSpecification() });

    return platformAccount;
  }

  async platformLoginCallback(platform: SignPlatform, param: PlatformLoginCallbackQueryDTO): Promise<string> {
    const accessToken = await this.getPlatformAccessToken(platform, param.code, param.state);
    const platformProfile = await this.getPlatformProfile(platform, accessToken);
    const platformAccount = await this.findOrCreatePlatformAccount(platformProfile);

    return this.createSignUrl(param.state, platform, platformAccount.user.id);
  }
}
