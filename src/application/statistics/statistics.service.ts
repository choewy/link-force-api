import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { And, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { DaliyStatistics } from './entities/daliy-statistics.entity';
import { GetDaliyStatisticsQueryDTO, GetDaliyStatisticsResultDTO } from './dto/get-daliy-statistics.dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(DaliyStatistics)
    private readonly daliyStatisticsRepository: Repository<DaliyStatistics>,
  ) {}

  async getDaliyStatistics(linkId: string, query: GetDaliyStatisticsQueryDTO): Promise<GetDaliyStatisticsResultDTO> {
    const whereDates = [query.startDate ? MoreThanOrEqual(query.startDate) : null, query.endDate ? LessThanOrEqual(query.endDate) : null].filter((whereDate) => !!whereDate);
    const [daliyStatistics, count] = await this.daliyStatisticsRepository.findAndCount({
      where: { linkId, date: whereDates.length > 0 ? And(...whereDates) : undefined },
      skip: query.skip,
      take: query.take,
      order: { date: 'DESC' },
    });

    return new GetDaliyStatisticsResultDTO(daliyStatistics, count);
  }
}
