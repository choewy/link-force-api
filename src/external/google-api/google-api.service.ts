import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import * as qs from 'qs';

import { AxiosErrorException } from 'src/persistent/exceptions';
import { GoogleApiConfigFactory } from 'src/common/config/providers/google-api-config.factory';

import { GoogleLoginURLRequestParam, GoogleProfileResponse, GoogleTokenRequestParam, GoogleTokenResponse } from './types';

@Injectable()
export class GoogleApiService {
  constructor(
    private readonly googleApiConfigFactory: GoogleApiConfigFactory,
    private readonly httpService: HttpService,
  ) {}

  public getLoginPageURL(state: string): string {
    const url = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = qs.stringify({
      response_type: 'code',
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'].join(' '),
      client_id: this.googleApiConfigFactory.getClientID(),
      redirect_uri: this.googleApiConfigFactory.getLoginRedirectURI(),
      state,
    } as GoogleLoginURLRequestParam);

    return [url, params].join('?');
  }

  async getLoginToken(code: string) {
    const url = 'https://oauth2.googleapis.com/token';
    const params = {
      grant_type: 'authorization_code',
      client_id: this.googleApiConfigFactory.getClientID(),
      client_secret: this.googleApiConfigFactory.getClientSecret(),
      redirect_uri: this.googleApiConfigFactory.getLoginRedirectURI(),
      code,
    } as GoogleTokenRequestParam;

    const response = await lastValueFrom(
      this.httpService.post<GoogleTokenResponse>(url, null, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params,
      }),
    ).catch((e) => {
      throw new AxiosErrorException(e as AxiosError, 'GoogleGetAuthTokenFailedError');
    });

    return response.data;
  }

  public getConnectPageURL(state: string): string {
    const url = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = qs.stringify({
      response_type: 'code',
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'].join(' '),
      client_id: this.googleApiConfigFactory.getClientID(),
      redirect_uri: this.googleApiConfigFactory.getConnectRedirectURI(),
      state,
    } as GoogleLoginURLRequestParam);

    return [url, params].join('?');
  }

  async getConnectToken(code: string) {
    const url = 'https://oauth2.googleapis.com/token';
    const params = {
      grant_type: 'authorization_code',
      client_id: this.googleApiConfigFactory.getClientID(),
      client_secret: this.googleApiConfigFactory.getClientSecret(),
      redirect_uri: this.googleApiConfigFactory.getConnectRedirectURI(),
      code,
    } as GoogleTokenRequestParam;

    const response = await lastValueFrom(
      this.httpService.post<GoogleTokenResponse>(url, null, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        params,
      }),
    ).catch((e) => {
      throw new AxiosErrorException(e as AxiosError, 'GoogleGetAuthTokenFailedError');
    });

    return response.data;
  }

  async getProfile(accessToken: string) {
    const url = 'https://www.googleapis.com/userinfo/v2/me';

    const response = await lastValueFrom(
      this.httpService.get<GoogleProfileResponse>(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    ).catch((e) => {
      throw new AxiosErrorException(e as AxiosError, 'GoogleGetProfileFailedError');
    });

    return response.data;
  }
}
