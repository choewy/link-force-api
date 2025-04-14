import { KakaoProfileResponse } from 'src/external/kakao-api/types';
import { NaverProfileResponse } from 'src/external/naver-api/types';
import { GoogleProfileResponse } from 'src/external/google-api/types';

import { OAuth } from '../entities/oauth.entity';

import { OAuthPlatform } from './enums';
import { OAuthProfileResponse } from './types';

export class OAuthProfile implements Pick<OAuth, 'platform' | 'accountId' | 'nickname' | 'name' | 'email' | 'profileImage'> {
  constructor(
    readonly platform: OAuthPlatform,
    readonly accountId: string,
    readonly email: string,
    readonly name: string,
    readonly nickname: string | null,
    readonly profileImage: string | null,
  ) {}

  public static of(platform: OAuthPlatform, profile: OAuthProfileResponse) {
    switch (platform) {
      case OAuthPlatform.Kakao:
        return this.fromKakao(profile as KakaoProfileResponse);

      case OAuthPlatform.Naver:
        return this.fromNaver(profile as NaverProfileResponse);

      case OAuthPlatform.Google:
        return this.fromGoogle(profile as GoogleProfileResponse);
    }
  }

  private static fromKakao(kakaoProfile: KakaoProfileResponse) {
    return new OAuthProfile(
      OAuthPlatform.Kakao,
      kakaoProfile.id,
      kakaoProfile.kakao_account.email ?? null,
      kakaoProfile.kakao_account.name ?? null,
      kakaoProfile.kakao_account.profile.nickname ?? null,
      kakaoProfile.kakao_account.profile.profile_image_url ?? null,
    );
  }

  private static fromNaver(naverProfile: NaverProfileResponse) {
    return new OAuthProfile(
      OAuthPlatform.Naver,
      naverProfile.response.id,
      naverProfile.response.email ?? null,
      naverProfile.response.name ?? null,
      naverProfile.response.nickname ?? null,
      naverProfile.response.profile_image ?? null,
    );
  }

  private static fromGoogle(googleProfile: GoogleProfileResponse) {
    return new OAuthProfile(OAuthPlatform.Google, googleProfile.id, googleProfile.email, googleProfile.name, googleProfile.name, googleProfile.picture);
  }
}
