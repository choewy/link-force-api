import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ContextModule } from './common/context/context.module';
import { ConfigFactoryModule } from './common/config/config-factory.module';
import { TypeOrmConfigFactory } from './common/config/providers/typeorm-config.factory';

import { SignModule } from './application/sign/sign.module';
import { UserModule } from './application/user/user.module';
import { LinkModule } from './application/link/link.module';
import { LogModule } from './application/log/log.module';
import { StatisticsModule } from './application/statistics/statistics.module';

@Module({
  imports: [
    ContextModule,
    ConfigFactoryModule,
    LoggerModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [TypeOrmConfigFactory],
      useFactory(typeOrmConfigFactory: TypeOrmConfigFactory) {
        return typeOrmConfigFactory.getTypeOrmModuleOptions();
      },
    }),
    SignModule,
    UserModule,
    LinkModule,
    LogModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
