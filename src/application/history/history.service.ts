import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ContextService } from 'src/common/context/context.service';

import { HitHistory } from './entities/hit-history.entity';
import { GetHitHistoriesQueryDTO, GetHitHistoriesResultDTO } from './dto/get-hit-histories.dto';

@Injectable()
export class HistoryService {
  constructor(
    private readonly contextService: ContextService,
    @InjectRepository(HitHistory)
    private readonly hitHistoryRepository: Repository<HitHistory>,
  ) {}

  async getHistories(linkId: string, query: GetHitHistoriesQueryDTO) {
    const [histories, count] = await this.hitHistoryRepository.findAndCount({
      relations: { link: true },
      where: { linkId, link: { userId: this.contextService.getRequestUserID() } },
      skip: query.skip,
      take: query.take,
      order: { createdAt: 'DESC' },
    });

    return new GetHitHistoriesResultDTO(histories, count);
  }
}
