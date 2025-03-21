import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TimerModule } from 'src/common/timer/timer.module';
import { Link } from 'src/domain/entities/link.entity';
import { LinkStatistics } from 'src/domain/entities/link-statistics.entity';
import { LinkHitHistory } from 'src/domain/entities/link-hit-history.entity';
import { UserSpecification } from 'src/domain/entities/user-specification.entity';
import { AuthModule } from 'src/application/auth/auth.module';

import { LinkController } from './link.controller';
import { LinkService } from './link.service';

@Module({
  imports: [AuthModule, TimerModule, TypeOrmModule.forFeature([Link, LinkStatistics, LinkHitHistory, UserSpecification])],
  controllers: [LinkController],
  providers: [LinkService],
  exports: [LinkService],
})
export class LinkModule {}
