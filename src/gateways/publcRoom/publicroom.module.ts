import * as redisStore from 'cache-manager-ioredis';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { PublicRoomGateway } from './publicroom.gateway';
import { RedisCacheModule } from 'src/cache/rediscache.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { LessonRoom } from 'src/entities/lessonRoom.entity';
import { PublicRoomnService } from './publicroomn.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, LessonRoom]), RedisCacheModule],
  controllers: [],
  providers: [PublicRoomGateway, PublicRoomnService],
})
export class PublicRoomModule {}
