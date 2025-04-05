import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

import { HitHistory } from '../entities/hit-history.entity';

import { HitHistoryDTO } from './hit-history.dto';

export class GetHitHistoriesQueryDTO {
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
}

export class GetHitHistoriesParamDTO {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  linkId: string;
}

export class GetHitHistoriesResultDTO {
  @ApiProperty({ type: Number })
  count: number;

  @ApiProperty({ type: [HitHistoryDTO] })
  rows: HitHistoryDTO[];

  constructor(histories: HitHistory[], count: number) {
    this.count = count;
    this.rows = histories.map((e) => new HitHistoryDTO(e));
  }
}
