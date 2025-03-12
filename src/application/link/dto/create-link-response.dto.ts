import { ApiProperty } from '@nestjs/swagger';
import { Link } from 'src/domain/entities/link.entity';

export class CreateLinkResponseDTO {
  @ApiProperty({ type: String, format: 'url' })
  url: string;

  constructor(host: string, link: Link) {
    this.url = [host, link.id].join('/');
  }
}
