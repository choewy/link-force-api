import { ApiProperty } from '@nestjs/swagger';

import { Link } from 'src/domain/entities/link.entity';

import { LinkDTO } from './link.dto';

export class GetLinksResponseDTO {
  @ApiProperty({ type: [LinkDTO] })
  rows: LinkDTO[];

  @ApiProperty({ type: Number })
  count: number;

  constructor(links: Link[], count: number) {
    this.rows = links.map((link) => new LinkDTO(link));
    this.count = count;
  }
}
