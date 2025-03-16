import { HttpStatus } from '@nestjs/common';

export enum LinkType {
  Free = 'free',
  Plan = 'plan',
}

export enum LinkStatusCode {
  Found = HttpStatus.FOUND,
  Permanently = HttpStatus.MOVED_PERMANENTLY,
}

export enum LinkStatus {
  Activated = 'activated',
  Disabled = 'disabled',
}
