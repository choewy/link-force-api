import { Module } from '@nestjs/common';

import { TimerModule } from 'src/common/timer/timer.module';

import { LinkController } from './link.controller';
import { LinkService } from './link.service';

@Module({
  imports: [TimerModule],
  controllers: [LinkController],
  providers: [LinkService],
  exports: [LinkService],
})
export class LinkModule {}
