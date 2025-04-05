import { ApiProperty } from '@nestjs/swagger';

import { HitHistory } from '../entities/hit-history.entity';

export class HitHistoryDTO {
  @ApiProperty({ type: String })
  ip: string;

  @ApiProperty({ type: String })
  userAgent: string;

  @ApiProperty({ type: String })
  referer: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  constructor(entity: HitHistory) {
    this.ip = entity.ip;
    this.userAgent = entity.userAgent;
    this.referer = entity.referer;
    this.createdAt = entity.createdAt;
  }
}
