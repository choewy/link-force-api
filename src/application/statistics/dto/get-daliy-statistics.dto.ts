import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, Min } from 'class-validator';

import { DaliyStatistics } from '../entities/daliy-statistics.entity';

import { DaliyStatisticsDTO } from './statistics.dto';

export class GetDaliyStatisticsParamDTO {
  @ApiProperty({ type: String, description: '링크 ID' })
  @IsString()
  @Length(7, 7)
  @IsNotEmpty()
  linkId: string;
}

export class GetDaliyStatisticsQueryDTO {
  @ApiProperty({ type: Number })
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  skip: number;

  @ApiProperty({ type: Number })
  @Max(1000)
  @IsInt()
  @IsNotEmpty()
  take: number;

  @ApiPropertyOptional({ type: Date, description: '검색 시작일자' })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ type: Date, description: '검색 종료일자' })
  @IsDate()
  @IsOptional()
  endDate?: Date;
}

export class GetDaliyStatisticsResultDTO {
  @ApiProperty({ type: Number, description: '총 통계 개수' })
  count: number;

  @ApiProperty({ type: [DaliyStatisticsDTO], description: '통계 목록' })
  rows: DaliyStatisticsDTO[];

  constructor(daliyStatistics: DaliyStatistics[], count: number) {
    this.count = count;
    this.rows = daliyStatistics.map((daliyStatistics) => new DaliyStatisticsDTO(daliyStatistics));
  }
}
