import { TasksService } from "./tasks.service";
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
