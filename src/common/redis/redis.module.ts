import { DynamicModule, Provider } from '@nestjs/common';

import Redis from 'ioredis';

import { RedisModuleAsyncOptions } from './types';
import { RedisServivce } from './redis.service';

export class RedisModule {
  public static forRootAsync(asyncOptions: RedisModuleAsyncOptions): DynamicModule {
    const RedisProvider: Provider = {
      inject: asyncOptions.inject,
      provide: RedisServivce,
      async useFactory(...args: unknown[]) {
        return new RedisServivce(new Redis(await asyncOptions.useFactory(...args)));
      },
    };

    return {
      global: true,
      module: RedisModule,
      providers: [RedisProvider],
      exports: [RedisProvider],
    };
  }
}
