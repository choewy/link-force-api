import { Injectable, OnModuleDestroy } from '@nestjs/common';

import Redis from 'ioredis';

@Injectable()
export class RedisServivce implements OnModuleDestroy {
  constructor(private readonly redis: Redis) {}

  onModuleDestroy() {
    this.redis.disconnect(false);
  }

  private from(value: string | null): object | null {
    return value == null ? null : (JSON.parse(value) as object);
  }

  private to<T>(value: T): string {
    return JSON.stringify(value, null, 2);
  }

  async setValue<T>(key: string, value: T, expiresIn?: number): Promise<void> {
    await this.redis.set(key, this.to(value));

    if (expiresIn) {
      await this.redis.expire(key, expiresIn);
    }
  }

  async getValue(key: string): Promise<object | null> {
    return this.from(await this.redis.get(key));
  }

  async getHashValue(key: string, fieldName: string): Promise<string | null> {
    return this.redis.hget(key, fieldName);
  }

  async setHashValue(key: string, o: object): Promise<void> {
    await this.redis.hset(key, o);
  }

  async removeHashValues(key: string, ...fieldNames: string[]): Promise<void> {
    await this.redis.hdel(key, ...fieldNames);
  }
}
