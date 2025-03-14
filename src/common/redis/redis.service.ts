import { Injectable, OnModuleDestroy } from '@nestjs/common';

import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(private readonly redis: Redis) {}

  onModuleDestroy() {
    this.redis.disconnect(false);
  }

  private from<T>(value: string | null): T | null {
    return value == null ? null : (JSON.parse(value) as T);
  }

  private to<T>(value: T): string {
    return JSON.stringify(value, null, 2);
  }

  async getValue<T>(key: string): Promise<T | null> {
    return this.from<T>(await this.redis.get(key));
  }

  async setValue<T>(key: string, value: T, expiresIn?: number): Promise<void> {
    await this.redis.set(key, this.to(value));

    if (expiresIn) {
      await this.redis.expire(key, expiresIn);
    }
  }

  async removeValue(key: string) {
    if (!(await this.redis.exists(key))) {
      return;
    }

    await this.redis.del(key);
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
