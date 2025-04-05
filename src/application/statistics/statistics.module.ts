import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TotalStatistics } from './entities/total-statistics.entity';
import { DaliyStatistics } from './entities/daliy-statistics.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [TypeOrmModule.forFeature([TotalStatistics, DaliyStatistics])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
