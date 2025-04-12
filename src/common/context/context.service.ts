import { Injectable } from '@nestjs/common';

import { ClsService } from 'nestjs-cls';
import { Request } from 'express';
import { DateTime } from 'luxon';

import { ContextKey } from './enums';
import { RequestHeader } from 'src/persistent/enums';

@Injectable()
export class ContextService {
  constructor(private readonly clsService: ClsService) {}

  getRequestId(): string {
    return this.clsService.get(ContextKey.RequestID);
  }

  getRequestTimestamp(): number {
    return this.clsService.get(ContextKey.RequestTimestamp);
  }

  getRequestDateTime(): string {
    return String(DateTime.fromJSDate(new Date(this.getRequestTimestamp() ?? Date.now())).toISO({ includeOffset: true }));
  }

  getRequestLatency(): number {
    const requestTimestamp = this.getRequestTimestamp();

    if (requestTimestamp === 0) {
      return 0;
    }

    return (Date.now() - requestTimestamp) / 1000;
  }

  setRequestUserID(id: string | null) {
    this.clsService.set(ContextKey.RequestUserID, id);
  }

  getRequestUserID(): string | undefined {
    return this.clsService.get(ContextKey.RequestUserID) ?? undefined;
  }

  setRequestOAuthKey(platform: string | null, accountId: string | null) {
    this.clsService.set(ContextKey.RequestOAuthPlatform, platform);
    this.clsService.set(ContextKey.RequestOAuthAccountID, accountId);
  }

  getRequestOAuthKey(): {
    platform: string | null;
    accountId: string | null;
  } {
    return {
      platform: this.clsService.get(ContextKey.RequestOAuthPlatform),
      accountId: this.clsService.get(ContextKey.RequestOAuthAccountID),
    };
  }

  getRequest(): Request {
    return this.clsService.get(ContextKey.Request);
  }

  getRequestIP(): string {
    const request = this.getRequest();

    if (Array.isArray(request.headers[RequestHeader.XforwardedFor])) {
      return request.headers[RequestHeader.XforwardedFor].shift() ?? '';
    }

    return request.headers[RequestHeader.XforwardedFor] ?? request.ip ?? '';
  }

  getRequestUserAgent(): string {
    return this.getRequest().headers[RequestHeader.Useragent] ?? '';
  }

  getRequestReferer(): string {
    return this.getRequest().headers[RequestHeader.Referer] ?? '';
  }
}
