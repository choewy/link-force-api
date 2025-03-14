import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RedisOptions } from 'ioredis';

@Injectable()
export class RedisConfigFactory {
  constructor(private readonly configService: ConfigService) {}

  public getRedisModuleOptions(): RedisOptions {
    return {
      host: this.configService.getOrThrow('REDIS_HOST'),
      port: this.configService.getOrThrow('REDIS_PORT'),
      db: this.configService.get('REDIS_DB') ?? 0,
    };
  }
}
