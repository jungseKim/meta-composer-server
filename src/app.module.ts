import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FacebookStrategy } from './auth/facebook.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './config/ormconfig';
import { UserModule } from './user/user.module';
import { LessonsModule } from './lessons/lessons.module';
import { SignupsController } from './signups/signups.controller';
import { SignupsService } from './signups/signups.service';

import { SignupsModule } from './signups/signups.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AppController],
  providers: [AppService ],
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(ormconfig),
    UserModule,
    LessonsModule,
    SignupsModule,
    ConfigModule.forRoot({ isGlobal: true,}),
  ],
})
export class AppModule {}
//asd