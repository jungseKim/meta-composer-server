import { RoomGateway } from './gateways/roomGateway/room.gateway';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './gateways/chatGateway/chat.gateway';
import { AuthModule } from './auth/auth.module';
import { FacebookStrategy } from './auth/facebook.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { WebRtcGateway } from './gateways/rtcGateway/web-rtc.gateway';
import { RoomModule } from './room/room.module';

@Module({
  controllers: [AppController],
  providers: [AppService, ChatGateway, WebRtcGateway, RoomGateway],
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    UserModule,
    RoomModule,
  ],
})
export class AppModule {}
