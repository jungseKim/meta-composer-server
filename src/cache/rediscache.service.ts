/*
https://docs.nestjs.com/providers#services
*/

import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { timingSafeEqual } from 'crypto';
import { RoomList } from 'src/types/redis';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {
    this.cache.set('roomList', {});
  }

  public async set(key: string, value: string | number): Promise<void> {
    const redisValue = await this.cache.set(
      key,
      { value: value },
      {
        ttl: 60 * 60 * 1000,
      },
    );
    console.log('저장');
  }
  public async get(key: string) {
    const redisValue = await this.cache.get(key);
    console.log('꺼냄');
    return redisValue;
  }
  public async delete(key: string): Promise<void> {
    await this.cache.del(key);
    console.log('삭제');
  }
  public async addRoom(key: string, value: string): Promise<void> {
    const redisValu2: RoomList = await this.cache.get('roomList');
    redisValu2[key] = value;
    await this.cache.set('roomList', redisValu2);
    console.log(await this.cache.get('roomList'));
    console.log('저장');
  }
  public async removeRoom(key) {}
}
