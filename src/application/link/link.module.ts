import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Link } from 'src/application/link/entities/link.entity';
import { AuthModule } from 'src/application/auth/auth.module';

import { UserSpecification } from '../user/entities/user-specification.entity';
import { TotalStatistics } from '../statistics/entities/total-statistics.entity';
import { DaliyStatistics } from '../statistics/entities/daliy-statistics.entity';
import { HitHistory } from '../history/entities/hit-history.entity';

import { LinkController } from './link.controller';
import { LinkService } from './link.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Link, TotalStatistics, DaliyStatistics, HitHistory, UserSpecification])],
  controllers: [LinkController],
  providers: [LinkService],
  exports: [LinkService],
})
export class LinkModule {}
