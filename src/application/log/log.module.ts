import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HitLog } from './entities/hit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HitLog])],
})
export class LogModule {}
