import { ApiProperty } from '@nestjs/swagger';

import { Link } from 'src/application/link/entities/link.entity';

import { LinkDTO } from './link.dto';

export class GetLinksResultDTO {
  @ApiProperty({ type: [LinkDTO] })
  rows: LinkDTO[];

  @ApiProperty({ type: Number })
  count: number;

  constructor(links: Link[], count: number) {
    this.rows = links.map((link) => new LinkDTO(link));
    this.count = count;
  }
}
