import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigFactory } from './providers/app-config.factory';
import { ServerConfigFactory } from './providers/server-config.factory';
import { TypeOrmConfigFactory } from './providers/typeorm-config.factory';
import { JwtConfigFactory } from './providers/jwt-config.factory';
import { KakaoApiConfigFactory } from './providers/kakao-api-config.factory';

const ConfigFactoryProviders = [AppConfigFactory, ServerConfigFactory, TypeOrmConfigFactory, JwtConfigFactory, KakaoApiConfigFactory];

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: ConfigFactoryProviders,
  exports: ConfigFactoryProviders,
})
export class ConfigFactoryModule {}
