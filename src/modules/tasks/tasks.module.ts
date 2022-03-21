import { Signup } from "src/entities/signup.entity";
import { TasksService } from "./tasks.service";
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";
import { NotificationModule } from "src/gateways/notification/notification.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Signup]), NotificationModule],
  controllers: [],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
