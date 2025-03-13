import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AppConfigFactory } from './app-config.factory';

@Injectable()
export class TypeOrmConfigFactory {
  constructor(
    private readonly appConfigFactory: AppConfigFactory,
    private readonly configService: ConfigService,
  ) {}

  public getTypeOrmModuleOptions(): TypeOrmModuleOptions {
    const nodeEnv = this.appConfigFactory.getNodeEnv();

    return {
      type: 'mysql',
      host: this.configService.getOrThrow('DB_HOST'),
      port: +this.configService.getOrThrow('DB_PORT'),
      username: this.configService.getOrThrow('DB_USERNAME'),
      password: this.configService.getOrThrow('DB_PASSWORD'),
      database: this.configService.getOrThrow('DB_DATABASE'),
      synchronize: nodeEnv.isLocal() && this.configService.get('DB_SYNCHRONIZE') === 'true',
      logging: nodeEnv.isLocal() ? ['query', 'info', 'error', 'warn'] : ['error', 'warn'],
      entities: [`${process.cwd()}/dist/**/*.entity.{js,ts}`],
      namingStrategy: new SnakeNamingStrategy(),
    };
  }
}
