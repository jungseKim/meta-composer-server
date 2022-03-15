import { NotificationService } from './modules/notification/notification.service';
import { NotificationModule } from './modules/notification/notification.module';
import { ChatModule } from './gateways/chatGateway/chat.module';

import { PublicRoomModule } from './gateways/publcRoom/publicroom.module';
import * as redisStore from 'cache-manager-ioredis';
import { LessonSocketModule } from './gateways/real-time-lesson/lessonsocket.module';
import { SetupModule } from './gateways/setup/setup.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FacebookStrategy } from './auth/facebook.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { WebRtcGateway } from './gateways/rtcGateway/web-rtc.gateway';
import { RoomModule } from './room/room.module';
import { LessonsModule } from './lessons/lessons.module';
import { SignupsModule } from './signups/signups.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TeachersModule } from './teachers/teachers.module';
import ORMConfig from './config/ormconfig';
import { CommentsModule } from './comments/comments.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { SheetsModule } from './sheets/sheets.module';
import { PaymentsModule } from './payments/payments.module';
import { ConcoursModule } from './concours/concours.module';
import { ConcoursSignupsModule } from './concours-signups/concours-signups.module';
import { RedisCacheModule } from './cache/rediscache.module';

@Module({
  controllers: [AppController],
  providers: [AppService, WebRtcGateway],
  imports: [
    NotificationModule,
    ChatModule,
    RedisCacheModule,
    PublicRoomModule,
    LessonSocketModule,
    AuthModule,
    RoomModule,
    SetupModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRoot(ORMConfig),
    UserModule,
    LessonsModule,
    SignupsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '6000s' },
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
