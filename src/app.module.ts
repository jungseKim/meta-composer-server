import { GatewayModule } from './gateways/gateway.module';
import { TestModule } from './gateways/test.module';
import { LessonGateway } from './gateways/real-time-lesson/lesson.gateway';
import { SetupModule } from './gateways/setup/setup.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './gateways/chatGateway/chat.gateway';
import { AuthModule } from './auth/auth.module';
import { FacebookStrategy } from './auth/facebook.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { WebRtcGateway } from './gateways/web-rtc.gateway';
import { RoomModule } from './room/room.module';

@Module({
  controllers: [AppController],
  providers: [LessonGateway, AppService, ChatGateway],
  imports: [
    GatewayModule,
    AuthModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    RoomModule,
    SetupModule,
    TestModule,
  ],
})
export class AppModule {}
