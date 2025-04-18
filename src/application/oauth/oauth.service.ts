import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';
import * as qs from 'qs';

import { ContextService } from 'src/common/context/context.service';
import { KakaoApiService } from 'src/external/kakao-api/kakao-api.service';
import { NaverApiService } from 'src/external/naver-api/naver-api.service';
import { GoogleApiService } from 'src/external/google-api/google-api.service';

import { User } from '../user/entities/user.entity';
import { UserSpecification } from '../user/entities/user-specification.entity';
import { AuthService } from '../auth/auth.service';

import { OAuth } from './entities/oauth.entity';
import { OAuthProfileResponse } from './persistents/types';
import { OAuthPlatform } from './persistents/enums';
import { OAuthProfile } from './persistents/oauth-profile';
import { GetOAuthLoginUrlBodyDTO, GetOAuthLoginUrlResultDTO } from './dto/get-oauth-login-url.dto';
import { ProcessOAuthLoginCallbackQueryDTO } from './dto/process-oauth-login-callback.dto';
import { OAuthCallbackState } from './persistents/oauth-callback-state';
import { Link } from '../link/entities/link.entity';

@Injectable()
export class OAuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly contextService: ContextService,
    private readonly kakaoApiService: KakaoApiService,
    private readonly naverApiService: NaverApiService,
    private readonly googleApiService: GoogleApiService,
    private readonly authService: AuthService,
    @InjectRepository(OAuth)
    private readonly oauthRepository: Repository<OAuth>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  private getOAuthApiService(platform: OAuthPlatform) {
    switch (platform) {
      case OAuthPlatform.Kakao:
        return this.kakaoApiService;

      case OAuthPlatform.Naver:
        return this.naverApiService;

      case OAuthPlatform.Google:
        return this.googleApiService;
    }
  }

  private async findOrCreateOAuth(platform: OAuthPlatform, profile: OAuthProfileResponse, oauthCallbackState: OAuthCallbackState) {
    const { linkId, userId } = oauthCallbackState;

    let user: User | null = null;

    if (userId) {
      user = await this.userRepository.findOneBy({ id: userId });

      if (!user) {
        throw new BadRequestException('Invalid user ID');
      }
    }

    const oauthProfile = OAuthProfile.of(platform, profile);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      if (!user) {
        user = await this.userRepository.save({ email: oauthProfile.email, specification: new UserSpecification() });
      }

      const oauth = await this.oauthRepository.save({
        accountId: oauthProfile.accountId,
        platform: oauthProfile.platform,
        nickname: oauthProfile.nickname,
        name: oauthProfile.name,
        email: oauthProfile.email,
        profileImage: oauthProfile.profileImage,
        user,
      });

      oauth.user = user;

      if (linkId) {
        await this.linkRepository.update({ id: linkId }, { user });
      }

      await queryRunner.commitTransaction();

      return oauth;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  private async createRedirectUrl(oauth: OAuth, oauthCallbackState: OAuthCallbackState) {
    const { redirectUrl, userId } = oauthCallbackState;

    if (userId) {
      return redirectUrl;
    }

    const accessToken = this.authService.issueAccessToken(oauth.userId, String(oauth.platform), oauth.accountId);
    const refreshToken = this.authService.issueRefreshToken(accessToken);
    const authKey = await this.authService.setAuthToken(accessToken, refreshToken);

    return [redirectUrl, qs.stringify({ authKey })].join('?');
  }

  getLoginUrl(platform: OAuthPlatform, body: GetOAuthLoginUrlBodyDTO): GetOAuthLoginUrlResultDTO {
    const userId = this.contextService.getRequestUserID() ?? null;
    const state = new OAuthCallbackState(body.redirectUrl, body.linkId, userId).toString();

    return new GetOAuthLoginUrlResultDTO(this.getOAuthApiService(platform).getLoginPageURL(state));
  }

  async processLoginCallback(platform: OAuthPlatform, query: ProcessOAuthLoginCallbackQueryDTO) {
    const oauthCallbackState = OAuthCallbackState.from(query.state);
    const oauthApiService = this.getOAuthApiService(platform);
    const oauthToken = await oauthApiService.getLoginToken(query.code, query.state);
    const oauthProfile = await oauthApiService.getProfile(oauthToken.access_token);
    const oauth = await this.findOrCreateOAuth(platform, oauthProfile, oauthCallbackState);

    return this.createRedirectUrl(oauth, oauthCallbackState);
  }
}
