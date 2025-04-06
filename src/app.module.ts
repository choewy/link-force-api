import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ContextModule } from './common/context/context.module';
import { ConfigFactoryModule } from './common/config/config-factory.module';
import { LoggerConfigFactory } from './common/config/providers/logger-config.factory';
import { TypeOrmConfigFactory } from './common/config/providers/typeorm-config.factory';

import { SignModule } from './application/sign/sign.module';
import { UserModule } from './application/user/user.module';
import { LinkModule } from './application/link/link.module';
import { HistoryModule } from './application/history/history.module';
import { StatisticsModule } from './application/statistics/statistics.module';
import { MembershipModule } from './application/membership/membership.module';
import { PaymentModule } from './application/payment/payment.module';

@Module({
  imports: [
    ContextModule,
    ConfigFactoryModule,
    ScheduleModule.forRoot(),
    LoggerModule.forRootAsync({
      inject: [LoggerConfigFactory],
      useFactory(loggerConfigFactory: LoggerConfigFactory) {
        return loggerConfigFactory.getPinoLoggerConfig();
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [TypeOrmConfigFactory],
      useFactory(typeOrmConfigFactory: TypeOrmConfigFactory) {
        return typeOrmConfigFactory.getTypeOrmModuleOptions();
      },
    }),
    SignModule,
    UserModule,
    LinkModule,
    HistoryModule,
    StatisticsModule,
    MembershipModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
