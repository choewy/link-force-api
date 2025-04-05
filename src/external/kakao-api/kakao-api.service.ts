import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import * as qs from 'qs';

import { AxiosErrorException } from 'src/persistent/exceptions';
import { KakaoApiConfigFactory } from 'src/common/config/providers/kakao-api-config.factory';

import { KakaoLoginURLRequestParam, KakaoProfileResponse, KakaoTokenRequestParam, KakaoTokenResponse } from './types';

@Injectable()
export class KakaoApiService {
  constructor(
    private readonly kakaoApiConfigFactory: KakaoApiConfigFactory,
    private readonly httpService: HttpService,
  ) {}

  public getLoginPageURL(state: string): string {
    const url = 'https://kauth.kakao.com/oauth/authorize';
    const params = qs.stringify({
      response_type: 'code',
      client_id: this.kakaoApiConfigFactory.getClientID(),
      redirect_uri: this.kakaoApiConfigFactory.getLoginRedirectURI(),
      state,
    } as KakaoLoginURLRequestParam);

    return [url, params].join('?');
  }

  async getToken(code: string): Promise<KakaoTokenResponse> {
    const url = 'https://kauth.kakao.com/oauth/token';
    const body: KakaoTokenRequestParam = {
      grant_type: 'authorization_code',
      client_id: this.kakaoApiConfigFactory.getClientID(),
      client_secret: this.kakaoApiConfigFactory.getClientSecret(),
      redirect_uri: this.kakaoApiConfigFactory.getLoginRedirectURI(),
      code,
    };

    const response = await lastValueFrom(
      this.httpService.post<KakaoTokenResponse>(url, body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      }),
    ).catch((e) => {
      throw new AxiosErrorException(e as AxiosError, 'KakaoGetAuthTokenFailedError');
    });

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
        params: {
          secure_resource: true,
          property_keys: ['kakao_account.profile', 'kakao_account.name', 'kakao_account.email'],
        },
      }),
    ).catch((e) => {
      throw new AxiosErrorException(e as AxiosError, 'KakaoGetProfileFailedError');
    });

    response.data.id = String(response.data.id);

    return response.data;
  }
}
