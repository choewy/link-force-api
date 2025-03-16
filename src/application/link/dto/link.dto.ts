import { ApiProperty } from '@nestjs/swagger';

import { Link } from 'src/domain/entities/link.entity';
import { LinkStatusCode, LinkType } from 'src/domain/enums';

export class LinkDTO {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String, enum: LinkType })
  type: LinkType;

  @ApiProperty({ type: String })
  url: string;

  @ApiProperty({ type: Number, enum: [LinkStatusCode.Found, LinkStatusCode.Permanently] })
  statusCode: LinkStatusCode;

  @ApiProperty({ type: Date, nullable: true })
  expiredAt: Date | null;

  @ApiProperty({ type: Number })
  hitCount: number;

  constructor(link: Link) {
    this.id = link.id;
    this.type = link.type;
    this.url = link.url;
    this.statusCode = link.statusCode;
    this.expiredAt = link.expiredAt;
    this.hitCount = link.statistics?.hitCount;
  }
}
