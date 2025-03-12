import { ApiProperty } from '@nestjs/swagger';

import { LinkStatusCode } from 'src/domain/enums';
import { Link } from 'src/domain/entities/link.entity';

export class HitLinkResponseDTO {
  @ApiProperty({ type: String, format: 'url' })
  url: string;

  @ApiProperty({ type: Number, enum: LinkStatusCode })
  statusCode: LinkStatusCode;

  constructor(link: Link) {
    this.url = link.url;
    this.statusCode = link.statusCode;
  }
}
