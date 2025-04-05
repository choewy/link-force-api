import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ResponseType } from 'src/persistent/dtos';
import { SetRequiredRequestUserID } from 'src/persistent/decorators';

import { UseAuthGuard } from '../auth/auth.guard';

import { HistoryService } from './history.service';
import { GetHitHistoriesParamDTO, GetHitHistoriesQueryDTO, GetHitHistoriesResultDTO } from './dto/get-hit-histories.dto';

@ApiTags('현황')
@Controller('histories')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':linkId')
  @UseAuthGuard()
  @SetRequiredRequestUserID()
  @ApiOperation({ summary: '링크 접속 기록 조회' })
  @ApiOkResponse({ type: ResponseType(GetHitHistoriesResultDTO) })
  async getHistories(@Param() param: GetHitHistoriesParamDTO, @Query() query: GetHitHistoriesQueryDTO) {
    return this.historyService.getHistories(param.linkId, query);
  }
}
