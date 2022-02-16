import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chatGateway/chat.gateway';
import { AuthModule } from './auth/auth.module';
import { FacebookStrategy } from './auth/facebook.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { WebRtcGateway } from './rtcGateway/web-rtc.gateway';

@Module({
  controllers: [AppController],
  providers: [AppService, ChatGateway, WebRtcGateway],
  imports: [AuthModule, TypeOrmModule.forRoot(typeOrmConfig), UserModule],
})
export class AppModule {}
