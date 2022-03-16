import { NotificationController } from './notification.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
import { Notification } from 'src/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Notification])],
  controllers: [NotificationController],
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
