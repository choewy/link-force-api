import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TimerModule } from 'src/common/timer/timer.module';
import { Link } from 'src/domain/entities/link.entity';
import { LinkStatistics } from 'src/domain/entities/link-statistics.entity';
import { UserSpecification } from 'src/domain/entities/user-specification.entity';

import { LinkController } from './link.controller';
import { LinkService } from './link.service';

@Module({
  imports: [TimerModule, TypeOrmModule.forFeature([Link, LinkStatistics, UserSpecification])],
  controllers: [LinkController],
  providers: [LinkService],
  exports: [LinkService],
})
export class LinkModule {}
