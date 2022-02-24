import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FacebookStrategy } from './facebook.strategy';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'jungse',
      signOptions: {
        expiresIn: 60 * 60, //얼마나 지속할껀지 지금은 1시간
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtRefreshTokenStrategy,
    FacebookStrategy,
    UserService,
    JwtStrategy,
  ],
})
export class AuthModule {}
