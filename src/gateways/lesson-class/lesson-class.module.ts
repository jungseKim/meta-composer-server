import { LessonClassController } from "./lesson-class.controller";
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";
import { RedisCacheModule } from "src/cache/rediscache.module";
import { LessonClassGateway } from "./lesson-class.gateway";
import { LessonClassService } from "./lesson-class.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attendance } from "src/entities/attendance.entity";
import { Signuptimetable } from "src/entities/signuptimetable.entity";
import { User } from "src/entities/user.entity";

@Module({
  imports: [
    RedisCacheModule,
    TypeOrmModule.forFeature([Signuptimetable, User]),
  ],
  controllers: [LessonClassController],
  providers: [LessonClassGateway, LessonClassService],
  exports: [LessonClassService],
})
export class LessonClassModule {}
