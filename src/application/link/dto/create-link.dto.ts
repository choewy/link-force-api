import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty, IsUrl } from 'class-validator';

import { IsNotHostUrl } from 'src/common/validators/is-not-host-url';
import { Link } from '../entities/link.entity';

export class CreateLinkDTO {
  @ApiProperty({ type: String, example: '', description: '축약할 URL' })
  @IsNotHostUrl()
  @IsUrl()
  @IsNotEmpty()
  url: string;
}

export class CreateLinkResultDTO {
  @ApiProperty({ type: String, description: '링크 ID' })
  linkId: string;

  @ApiPropertyOptional({ type: Date, description: '만료일시' })
  expiredAt: Date | null;

  constructor(link: Link) {
    this.linkId = link.id;
    this.expiredAt = link.expiredAt;
  }
}
