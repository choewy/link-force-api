import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Link } from 'src/application/link/entities/link.entity';
import { LinkStatistics } from 'src/application/link/entities/link-statistics.entity';
import { LinkHitHistory } from 'src/application/link/entities/link-hit-history.entity';
import { AuthModule } from 'src/application/auth/auth.module';

import { UserSpecification } from '../user/entities/user-specification.entity';

import { LinkController } from './link.controller';
import { LinkService } from './link.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Link, LinkStatistics, LinkHitHistory, UserSpecification])],
  controllers: [LinkController],
  providers: [LinkService],
  exports: [LinkService],
})
export class LinkModule {}
