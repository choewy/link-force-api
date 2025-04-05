import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ResponseType } from 'src/persistent/dtos';

import { StatisticsService } from './statistics.service';
import { GetDaliyStatisticsParamDTO, GetDaliyStatisticsQueryDTO, GetDaliyStatisticsResultDTO } from './dto/get-daliy-statistics.dto';

@ApiTags('통계')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get(':linkId/daliy')
  @ApiOperation({ summary: '일별 통계 조회' })
  @ApiOkResponse({ type: ResponseType(GetDaliyStatisticsResultDTO) })
  async getDaliyStatistics(@Param() param: GetDaliyStatisticsParamDTO, @Query() query: GetDaliyStatisticsQueryDTO) {
    return this.statisticsService.getDaliyStatistics(param.linkId, query);
  }
}
