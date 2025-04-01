import { ApiProperty } from '@nestjs/swagger';

import { Link } from 'src/application/link/entities/link.entity';

import { LinkType } from '../persistents/enums';

export class LinkDTO {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String, enum: LinkType })
  type: LinkType;

  @ApiProperty({ type: String })
  url: string;

  @ApiProperty({ type: Date, nullable: true })
  expiredAt: Date | null;

  @ApiProperty({ type: Number })
  hitCount: number;

  constructor(link: Link) {
    this.id = link.id;
    this.type = link.type;
    this.url = link.url;
    this.expiredAt = link.expiredAt;
    this.hitCount = link.statistics?.hitCount;
  }
}
