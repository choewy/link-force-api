import { Injectable } from '@nestjs/common';

import { ClsService } from 'nestjs-cls';
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

  getRequestUserID(): string | null {
    return this.clsService.get(ContextKey.RequestUserID) ?? null;
  }
}
