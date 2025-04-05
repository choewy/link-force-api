import { ApiProperty } from '@nestjs/swagger';

import { Link } from 'src/application/link/entities/link.entity';

export class LinkDTO {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  url: string;

  @ApiProperty({ type: Date, nullable: true })
  expiredAt: Date | null;

  @ApiProperty({ type: Number })
  totalHitCount: number;

  constructor(link: Link) {
    this.id = link.id;
    this.url = link.url;
    this.expiredAt = link.expiredAt;
    this.totalHitCount = Number(link.totalStatistics?.hitCount ?? 0);
  }
}
