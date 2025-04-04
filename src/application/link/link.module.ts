import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Link } from 'src/application/link/entities/link.entity';
import { AuthModule } from 'src/application/auth/auth.module';

import { UserSpecification } from '../user/entities/user-specification.entity';
import { Statistics } from '../statistics/entities/statistics.entity';
import { HitLog } from '../log/entities/hit-log.entity';

import { LinkController } from './link.controller';
import { LinkService } from './link.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Link, Statistics, HitLog, UserSpecification])],
  controllers: [LinkController],
  providers: [LinkService],
  exports: [LinkService],
})
export class LinkModule {}
