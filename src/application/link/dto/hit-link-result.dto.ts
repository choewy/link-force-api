import { ApiProperty } from '@nestjs/swagger';

import { Link } from '../entities/link.entity';

export class HitLinkResultDTO {
  @ApiProperty({ type: String, example: '', description: '축약할 URL' })
  url: string;

  @ApiProperty({ type: Boolean, description: '광고 노출 여부' })
  isAdvertisementVisible: boolean;

  constructor(link: Link, isAdvertisementVisible: boolean) {
    this.url = link.url;
    this.isAdvertisementVisible = isAdvertisementVisible;
  }
}
