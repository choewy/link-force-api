import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigFactory } from './providers/app-config.factory';
import { ServerConfigFactory } from './providers/server-config.factory';
import { TypeOrmConfigFactory } from './providers/typeorm-config.factory';
import { RedisConfigFactory } from './providers/redis-config.factory';
import { JwtConfigFactory } from './providers/jwt-config.factory';
import { KakaoApiConfigFactory } from './providers/kakao-api-config.factory';
import { NaverApiConfigFactory } from './providers/naver-api-config.factory';
import { GoogleApiConfigFactory } from './providers/google-api-config.factory';

const ConfigFactoryProviders = [
  AppConfigFactory,
  ServerConfigFactory,
  TypeOrmConfigFactory,
  RedisConfigFactory,
  JwtConfigFactory,
  KakaoApiConfigFactory,
  NaverApiConfigFactory,
  GoogleApiConfigFactory,
];

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: ConfigFactoryProviders,
  exports: ConfigFactoryProviders,
})
export class ConfigFactoryModule {}
