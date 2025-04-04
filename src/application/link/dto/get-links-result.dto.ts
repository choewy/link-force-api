import { ApiProperty } from '@nestjs/swagger';

import { Link } from 'src/application/link/entities/link.entity';

import { LinkDTO } from './link.dto';

export class GetLinksResultDTO {
  @ApiProperty({ type: Number })
  count: number;

  @ApiProperty({ type: [LinkDTO] })
  rows: LinkDTO[];

  constructor(links: Link[], count: number) {
    this.count = count;
    this.rows = links.map((link) => new LinkDTO(link));
  }
}
