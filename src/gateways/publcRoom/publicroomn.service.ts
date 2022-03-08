import { RedisCacheService } from 'src/cache/rediscache.service';
import { Socket } from 'socket.io';
import { RedisCacheModule } from 'src/cache/rediscache.module';
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';

@Injectable()
export class PublicRoomnService {
  constructor(private RedisCacheService: RedisCacheService) {}

  public async auth(client: Socket): Promise<void> {
    const token = client.handshake.auth.token.split(' ')[1];
    const userId = await this.RedisCacheService.get(token);
    if (!token || !userId) {
      client.disconnect();
      return;
    }
    client.data.userId = userId;
  }
}
