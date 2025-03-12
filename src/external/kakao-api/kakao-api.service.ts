import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { lastValueFrom } from 'rxjs';
import * as qs from 'qs';

import { KakaoApiConfigFactory } from 'src/config/providers/kakao-api-config.factory';

import { KakaoLoginURLRequestParam, KakaoProfileResponse, KakaoTokenRequestParam, KakaoTokenResponse } from './types';

@Injectable()
export class KakaoApiService {
  constructor(
    private readonly kakaoApiConfigFactory: KakaoApiConfigFactory,
    private readonly httpService: HttpService,
  ) {}

  public getLoginPageURL(redirectUrl: string): string {
    const url = 'https://kauth.kakao.com/oauth/authorize';
    const params = qs.stringify({
      response_type: 'code',
      client_id: this.kakaoApiConfigFactory.getLoginClientID(),
      redirect_uri: this.kakaoApiConfigFactory.getLoginRedirectURI(),
      state: redirectUrl,
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

  async getProfile(accessToken: string): Promise<KakaoProfileResponse> {
    const url = 'https://kapi.kakao.com/v2/user/me';

    const response = await lastValueFrom(
      this.httpService.get<KakaoProfileResponse>(url, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    const profile = response.data;

    profile.id = String(profile.id);

    return profile;
  }
}
