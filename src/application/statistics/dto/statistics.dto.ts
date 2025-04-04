import { ApiProperty } from '@nestjs/swagger';

import { Statistics } from '../entities/statistics.entity';

export class StatisticsDTO {
  @ApiProperty({ description: '링크 ID' })
  linkId: string;

  @ApiProperty({ description: '요청수' })
  hitCount: number;

  constructor(statistics: Statistics) {
    this.linkId = statistics.linkId;
    this.hitCount = statistics.hitCount;
  }
}
