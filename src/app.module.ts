import { LessonGateway } from './gateways/real-time-lesson/lesson.gateway';
import { SetupModule } from './gateways/setup/setup.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './gateways/chatGateway/chat.gateway';
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
import { AssignmentModule } from './assignment/assignment.module';

@Module({
  controllers: [AppController],
  providers: [LessonGateway, AppService, ChatGateway, WebRtcGateway],
  imports: [
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

    AssignmentModule

  ],
})
export class AppModule {}
