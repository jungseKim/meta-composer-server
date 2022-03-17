import { TasksService } from "./tasks.service";
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";
import { NotificationModule } from "src/gateways/notification/notification.module";

@Module({
  imports: [NotificationModule],
  controllers: [],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
