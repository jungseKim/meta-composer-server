/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';

@Module({
  imports: [],
  controllers: [],
  providers: [NotificationGateway, NotificationService],
})
export class NotificationModule {}
