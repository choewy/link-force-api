import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { AppConfigFactory } from './app-config.factor';

@Injectable()
export class TypeOrmConfigFactory {
  constructor(
    private readonly appConfigFactory: AppConfigFactory,
    private readonly configService: ConfigService,
  ) {}

  public getTypeOrmModuleOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.getOrThrow('DB_HOST'),
      port: +this.configService.getOrThrow('DB_PORT'),
      username: this.configService.getOrThrow('DB_USERNAME'),
      password: this.configService.getOrThrow('DB_PASSWORD'),
      database: this.configService.getOrThrow('DB_DATABASE'),
      synchronize: this.appConfigFactory.getNodeEnv().isLocal() && this.configService.get('DB_SYNCHRONIZE') === 'true',
      namingStrategy: new SnakeNamingStrategy(),
      entities: [`${process.cwd()}/**/*.entity.{js,ts}`],
    };
  }
}
