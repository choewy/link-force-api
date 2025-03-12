import { HttpStatus } from '@nestjs/common';

export const LINK_ID_LENGTH = 7;

export enum LinkType {
  Free = 'free',
  Plan = 'plan',
}

export enum LinkStatusCode {
  Found = HttpStatus.FOUND,
  Permanently = HttpStatus.MOVED_PERMANENTLY,
}
