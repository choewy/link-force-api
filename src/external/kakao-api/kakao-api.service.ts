import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { lastValueFrom } from 'rxjs';
import qs from 'qs';

import { KakaoApiConfigFactory } from 'src/config/providers/kakao-api-config.factory';

import { KakaoLoginURLRequestParam, KakaoUserProfileResponse, KakaoTokenRequestParam, KakaoTokenResponse } from './types';

@Injectable()
export class KakaoApiService {
  constructor(
    private readonly kakaoApiConfigFactory: KakaoApiConfigFactory,
    private readonly httpService: HttpService,
  ) {}

  public getLoginPageURL(): string {
    const url = 'https://kauth.kakao.com/oauth/authorize';
    const params = qs.stringify({
      response_type: 'code',
      client_id: this.kakaoApiConfigFactory.getLoginClientID(),
      redirect_uri: this.kakaoApiConfigFactory.getLoginRedirectURI(),
    } as KakaoLoginURLRequestParam);

    return [url, params].join('?');
  }

  async getToken(code: string): Promise<KakaoTokenResponse> {
    const url = 'https://kauth.kakao.com/oauth/token';
    const body: KakaoTokenRequestParam = {
      grant_type: 'authorization_code',
      client_id: this.kakaoApiConfigFactory.getLoginClientID(),
      redirect_uri: this.kakaoApiConfigFactory.getLoginRedirectURI(),
      code,
    };

    const response = await lastValueFrom(
      this.httpService.post<KakaoTokenResponse>(url, body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      }),
    );

    return response.data;
  }

  async getUserProfile(accessToken: string): Promise<KakaoUserProfileResponse> {
    const url = 'https://kapi.kakao.com/v2/user/me';

    const response = await lastValueFrom(
      this.httpService.get<KakaoUserProfileResponse>(url, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    return response.data;
  }
}
