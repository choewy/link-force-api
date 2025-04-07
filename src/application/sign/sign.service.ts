import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';
import * as qs from 'qs';

import { AuthService } from 'src/application/auth/auth.service';
import { PlatformAccount } from 'src/application/user/entities/platform-account.entity';
import { KakaoApiService } from 'src/external/kakao-api/kakao-api.service';
import { NaverApiService } from 'src/external/naver-api/naver-api.service';
import { GoogleApiService } from 'src/external/google-api/google-api.service';
import { ContextService } from 'src/common/context/context.service';

import { SignPlatform } from '../user/persistents/enums';
import { User } from '../user/entities/user.entity';
import { UserSpecification } from '../user/entities/user-specification.entity';

import { PlatformProfile } from './persistents/platform-profile';
import { GetSignTokenDTO } from './dto/get-sign-token.dto';
import { GetSignTokenResultDTO } from './dto/get-sign-token-result.dto';
import { GetPlatformLoginPageUrlResultDTO } from './dto/get-platform-login-page-url-result.dto';
import { PlatformLoginCallbackQueryDTO } from './dto/platform-login-callback-query.dto';
import { RefreshSignTokenBodyDTO, RefreshSignTokenResultDTO } from './dto/refresh-sign-token.dto';

@Injectable()
export class SignService {
  constructor(
    private readonly contextService: ContextService,
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSpecification)
    private readonly userSpecificationRepository: Repository<UserSpecification>,
    @InjectRepository(PlatformAccount)
    private readonly platformAccountRepository: Repository<PlatformAccount>,
    private readonly authService: AuthService,
    private readonly kakaoApiService: KakaoApiService,
    private readonly naverApiService: NaverApiService,
    private readonly googleApiService: GoogleApiService,
  ) {}

  async getSignToken(getSignTokenDTO: GetSignTokenDTO): Promise<GetSignTokenResultDTO> {
    const tokens = await this.authService.getToken(getSignTokenDTO.authKey);

    if (!tokens) {
      throw new UnauthorizedException();
    }

    return new GetSignTokenResultDTO(tokens.accessToken, tokens.refreshToken);
  }

  refreshSignToken(refreshTokenDTO: RefreshSignTokenBodyDTO): RefreshSignTokenResultDTO {
    const request = this.contextService.getRequest();
    const accessToken = (request.headers.authorization ?? '').replace('Bearer ', '');

    const { id, platformAccountId } = this.authService.verifyAccessToken(accessToken, true);

    if (!id || !platformAccountId) {
      throw new UnauthorizedException();
    }

    const refreshToken = refreshTokenDTO.refreshToken;

    if (!this.authService.verifyRefreshToken(refreshToken, accessToken)) {
      throw new UnauthorizedException();
    }

    const newAccessToken = this.authService.issueAccessToken(id, platformAccountId);
    const newRefreshToken = this.authService.issueRefreshToken(newAccessToken);

    return new RefreshSignTokenResultDTO(newAccessToken, newRefreshToken);
  }

  public getPlatformLoginPageUrl(platform: SignPlatform, state: string): GetPlatformLoginPageUrlResultDTO {
    switch (platform) {
      case SignPlatform.Kakao:
        return new GetPlatformLoginPageUrlResultDTO(this.kakaoApiService.getLoginPageURL(state));

      case SignPlatform.Naver:
        return new GetPlatformLoginPageUrlResultDTO(this.naverApiService.getLoginPageURL(state));

      case SignPlatform.Google:
        return new GetPlatformLoginPageUrlResultDTO(this.googleApiService.getLoginPageURL(state));

      default:
        throw new BadRequestException();
    }
  }

  private async getPlatformAccessToken(platform: SignPlatform, code: string, state: string): Promise<string> {
    switch (platform) {
      case SignPlatform.Kakao:
        return (await this.kakaoApiService.getToken(code)).access_token;

      case SignPlatform.Naver:
        return (await this.naverApiService.getToken(code, state)).access_token;

      case SignPlatform.Google:
        return (await this.googleApiService.getToken(code)).access_token;

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

      case SignPlatform.Google:
        return PlatformProfile.fromGoogleProfile(await this.googleApiService.getProfile(accessToken));

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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = this.userRepository.create();
      await this.userRepository.insert(user);

      platformAccount = this.platformAccountRepository.create(platformProfile);
      platformAccount.user = user;

      await this.userSpecificationRepository.insert({ user });
      await this.platformAccountRepository.insert(platformAccount);
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    return platformAccount;
  }

  private async createSignUrl(redirectUrl: string, platform: SignPlatform, platformAccount: PlatformAccount): Promise<string> {
    const accessToken = this.authService.issueAccessToken(platformAccount.user.id, platformAccount.id);
    const refreshToken = this.authService.issueRefreshToken(accessToken);

    const authKey = await this.authService.setToken(accessToken, refreshToken);

    return [redirectUrl, qs.stringify({ platform, authKey })].join('?');
  }

  async platformLoginCallback(platform: SignPlatform, param: PlatformLoginCallbackQueryDTO): Promise<string> {
    const platformAccessToken = await this.getPlatformAccessToken(platform, param.code, param.state);
    const platformProfile = await this.getPlatformProfile(platform, platformAccessToken);
    const platformAccount = await this.findOrCreatePlatformAccount(platformProfile);

    return this.createSignUrl(param.state, platform, platformAccount);
  }
}
