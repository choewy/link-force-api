import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ContextModule } from './common/context/context.module';
import { ConfigFactoryModule } from './common/config/config-factory.module';
import { TypeOrmConfigFactory } from './common/config/providers/typeorm-config.factory';
import { RedisModule } from './common/redis/redis.module';
import { RedisConfigFactory } from './common/config/providers/redis-config.factory';

import { LinkModule } from './application/link/link.module';
import { SignModule } from './application/sign/sign.module';
import { UserModule } from './application/user/user.module';

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
    RedisModule.forRootAsync({
      inject: [RedisConfigFactory],
      useFactory(redisConfigFactory: RedisConfigFactory) {
        return redisConfigFactory.getRedisModuleOptions();
      },
    }),
    SignModule,
    UserModule,
    LinkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
