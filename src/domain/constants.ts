import { HttpStatus } from '@nestjs/common';

export const LINK_ID_LENGTH = 7;

export enum LinkType {
  Plan = 'plan',
  FreeTrial = 'free-trial',
}

export enum LinkStatusCode {
  Found = HttpStatus.FOUND,
  Permanently = HttpStatus.MOVED_PERMANENTLY,
}
