import { GoogleProfileResponse } from 'src/external/google-api/types';
import { KakaoProfileResponse } from 'src/external/kakao-api/types';
import { NaverProfileResponse } from 'src/external/naver-api/types';

export type OAuthProfileResponse = KakaoProfileResponse | NaverProfileResponse | GoogleProfileResponse;
