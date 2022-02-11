import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from './auth/auth.module';
import { FacebookStrategy } from './auth/facebook.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { UserModule } from './user/user.module';

@Module({
  controllers: [AppController],
  providers: [AppService, ChatGateway],
  imports: [AuthModule, TypeOrmModule.forRoot(typeOrmConfig), UserModule],
})
export class AppModule {}
