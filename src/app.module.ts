<<<<<<< HEAD
import { ChatModule } from "./gateways/chatGateway/chat.module";

import { PublicRoomModule } from "./gateways/publcRoom/publicroom.module";
import * as redisStore from "cache-manager-ioredis";
import { LessonSocketModule } from "./gateways/real-time-lesson/lessonsocket.module";
import { SetupModule } from "./gateways/setup/setup.module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "src/modules/auth/auth.module";
import { FacebookStrategy } from "./modules/auth/facebook.strategy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/modules/user/user.module";
import { WebRtcGateway } from "./gateways/rtcGateway/web-rtc.gateway";
import { RoomModule } from "src/modules/room/room.module";
import { LessonsModule } from "src/modules/lessons/lessons.module";
import { SignupsModule } from "src/modules/signups/signups.module";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TeachersModule } from "src/modules/teachers/teachers.module";
import ORMConfig from "./config/ormconfig";
import { CommentsModule } from "src/modules/comments/comments.module";
import { AssignmentsModule } from "src/modules/assignments/assignments.module";
import { WishlistsModule } from "./modules/wishlists/wishlists.module";
import { SheetsModule } from "./modules/sheets/sheets.module";
import { PaymentsModule } from "src/modules/payments/payments.module";
import { ConcoursModule } from "./modules/concours/concours.module";
import { ConcoursSignupsModule } from "./modules/concours-signups/concours-signups.module";
import { RedisCacheModule } from "./cache/rediscache.module";
=======
import { NotificationService } from './gateways/notification/notification.service';
import { NotificationModule } from './gateways/notification/notification.module';
import { ChatModule } from './gateways/chatGateway/chat.module';

import { PublicRoomModule } from './gateways/publcRoom/publicroom.module';
import * as redisStore from 'cache-manager-ioredis';
import { LessonSocketModule } from './gateways/real-time-lesson/lessonsocket.module';
import { SetupModule } from './gateways/setup/setup.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth.module';
import { FacebookStrategy } from './auth/facebook.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user.module';
import { WebRtcGateway } from './gateways/rtcGateway/web-rtc.gateway';
import { RoomModule } from './modules/room.module';
import { LessonsModule } from './modules/lessons.module';
import { SignupsModule } from './modules/signups.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TeachersModule } from './modules/teachers.module';
import ORMConfig from './config/ormconfig';
import { CommentsModule } from './modules/comments.module';
import { AssignmentsModule } from './modules/assignments.module';
import { WishlistsModule } from './modules/wishlists.module';
import { SheetsModule } from './modules/sheets.module';
import { PaymentsModule } from './payments/payments.module';
import { ConcoursModule } from './modules/concours.module';
import { ConcoursSignupsModule } from './modules/concours-signups.module';
import { RedisCacheModule } from './cache/rediscache.module';
>>>>>>> d2087aaa9df49eba11ec7b491b11af4725510517

@Module({
  controllers: [AppController],
  providers: [AppService, WebRtcGateway],
  imports: [
<<<<<<< HEAD
=======
    NotificationModule,
>>>>>>> d2087aaa9df49eba11ec7b491b11af4725510517
    ChatModule,
    RedisCacheModule,
    PublicRoomModule,
    LessonSocketModule,
    AuthModule,
    RoomModule,
    SetupModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    TypeOrmModule.forRoot(ORMConfig),
    UserModule,
    LessonsModule,
    SignupsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: "6000s" },
    }),
    TeachersModule,
    CommentsModule,
    AssignmentsModule,
    WishlistsModule,
    SheetsModule,
    PaymentsModule,
    ConcoursModule,
    ConcoursSignupsModule,
  ],
})
export class AppModule {}
