import { SetupService } from './setup/setup.service';
import { SetupModule } from './setup/setup.module';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { TestGuard } from './test.guard';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { WebRtcGateway } from './web-rtc.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User]), SetupModule],
  controllers: [],
  providers: [WebRtcGateway, TestGuard, UserService, SetupService],
})
export class TestModule {}
