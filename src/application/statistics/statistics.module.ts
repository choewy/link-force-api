import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Statistics } from './entities/statistics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Statistics])],
})
export class StatisticsModule {}
