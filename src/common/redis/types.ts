import { RedisOptions } from 'ioredis';

export type RedisModuleAsyncOptions = {
  inject?: any[];
  useFactory: (...args: any[]) => Promise<RedisOptions> | RedisOptions;
};
