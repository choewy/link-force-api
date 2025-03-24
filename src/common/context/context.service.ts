import { Injectable } from '@nestjs/common';

import { ClsService } from 'nestjs-cls';
import { DateTime } from 'luxon';

import { ContextKey } from './enums';

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

  setRequestPlatformAccountID(id: string | null) {
    this.clsService.set(ContextKey.RequestPlatformAccountID, id);
  }

  getRequestPlatformAccountID(): string | undefined {
    return this.clsService.get(ContextKey.RequestPlatformAccountID) ?? undefined;
  }
}
