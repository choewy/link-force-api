import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { lastValueFrom } from 'rxjs';
import * as qs from 'qs';

import { NaverApiConfigFactory } from 'src/common/config/providers/naver-api-config.factory';
import { NaverLoginURLRequestParam, NaverProfileResponse, NaverTokenRequestParam, NaverTokenResponse } from './types';

@Injectable()
export class NaverApiService {
  constructor(
    private readonly naverApiConfigFactory: NaverApiConfigFactory,
    private readonly httpService: HttpService,
  ) {}

  public getLoginPageURL(state: string): string {
    const url = 'https://nid.naver.com/oauth2.0/authorize';
    const params = qs.stringify({
      response_type: 'code',
      client_id: this.naverApiConfigFactory.getLoginClientID(),
      redirect_uri: this.naverApiConfigFactory.getLoginRedirectURI(),
      state,
    } as NaverLoginURLRequestParam);

    return [url, params].join('?');
  }

  async getToken(code: string, state: string) {
    const url = 'https://nid.naver.com/oauth2.0/token';
    const params = {
      grant_type: 'authorization_code',
      client_id: this.naverApiConfigFactory.getLoginClientID(),
      client_secret: this.naverApiConfigFactory.getLoginClientSecret(),
      code,
      state,
    } as NaverTokenRequestParam;

    const response = await lastValueFrom(this.httpService.get<NaverTokenResponse>(url, { params }));

    return response.data;
  }

  async getProfile(accessToken: string) {
    const url = 'https://openapi.naver.com/v1/nid/me';

    const response = await lastValueFrom(
      this.httpService.get<NaverProfileResponse>(url, {
        headers: {
          'Content-Type': 'text/json;charset=utf-8',
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );

    return response.data;
  }
}
