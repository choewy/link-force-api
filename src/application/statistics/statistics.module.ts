import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TotalStatistics } from './entities/total-statistics.entity';
import { DaliyStatistics } from './entities/daliy-statistics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TotalStatistics, DaliyStatistics])],
})
export class StatisticsModule {}
