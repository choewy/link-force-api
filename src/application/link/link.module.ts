import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';

import { LinkController } from './link.controller';
import { LinkService } from './link.service';

@Module({
  imports: [AuthModule],
  controllers: [LinkController],
  providers: [LinkService],
  exports: [LinkService],
})
export class LinkModule {}
