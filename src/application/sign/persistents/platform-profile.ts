import { KakaoProfileResponse } from 'src/external/kakao-api/types';
import { NaverProfileResponse } from 'src/external/naver-api/types';

import { PlatformAccount } from 'src/application/user/entities/platform-account.entity';
import { SignPlatform } from 'src/application/user/persistents/enums';

export class PlatformProfile implements Pick<PlatformAccount, 'platform' | 'accountId' | 'nickname' | 'name' | 'email' | 'profileImage'> {
  constructor(
    readonly platform: SignPlatform,
    readonly accountId: string,
    readonly nickname: string | null,
    readonly name: string | null,
    readonly email: string | null,
    readonly profileImage: string | null,
  ) {}

  public static fromKakaoProfile(kakaoProfile: KakaoProfileResponse) {
    return new PlatformProfile(
      SignPlatform.Kakao,
      kakaoProfile.id,
      kakaoProfile.kakao_account.profile.nickname ?? null,
      kakaoProfile.kakao_account.name ?? null,
      kakaoProfile.kakao_account.email ?? null,
      kakaoProfile.kakao_account.profile.profile_image_url ?? null,
    );
  }

  public static fromNaverProfile(naverProfile: NaverProfileResponse) {
    return new PlatformProfile(
      SignPlatform.Naver,
      naverProfile.response.id,
      naverProfile.response.nickname ?? null,
      naverProfile.response.name ?? null,
      naverProfile.response.email ?? null,
      naverProfile.response.profile_image ?? null,
    );
  }
}
