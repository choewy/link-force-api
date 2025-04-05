import { ApiProperty } from '@nestjs/swagger';

import { TotalStatistics } from '../entities/total-statistics.entity';
import { DaliyStatistics } from '../entities/daliy-statistics.entity';

export class StatisticsDTO {
  @ApiProperty({ description: '링크 ID' })
  linkId: string;

  @ApiProperty({ description: '요청수' })
  hitCount: number;

  constructor(totalStatistics: TotalStatistics) {
    this.linkId = totalStatistics.linkId;
    this.hitCount = totalStatistics.hitCount;
  }
}

export class DaliyStatisticsDTO {
  @ApiProperty({ description: '링크 ID' })
  linkId: string;

  @ApiProperty({ description: '일자' })
  date: Date;

  @ApiProperty({ description: '요청수' })
  hitCount: number;

  constructor(daliyStatistics: DaliyStatistics) {
    this.linkId = daliyStatistics.linkId;
    this.date = daliyStatistics.date;
    this.hitCount = daliyStatistics.hitCount;
  }
}
