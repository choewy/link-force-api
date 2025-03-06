import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigFactoryModule } from './config/config-factory.module';

@Module({
  imports: [ConfigFactoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
