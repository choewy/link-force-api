import { ApiProperty } from '@nestjs/swagger';

import { LinkType } from '../persistents/enums';
import { Link } from '../entities/link.entity';

export class HitLinkResultDTO {
  @ApiProperty({ type: String, example: '', description: '축약할 URL' })
  url: string;

  @ApiProperty({ type: String, enum: LinkType, description: '링크 생성 속성' })
  type: LinkType;

  constructor(link: Link) {
    this.url = link.url;
    this.type = link.type;
  }
}
