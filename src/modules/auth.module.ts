import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserModule } from 'src/modules/user.module';
import { UserService } from 'src/user/user.service';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { FacebookStrategy } from '../auth/facebook.strategy';
import { JwtRefreshTokenStrategy } from '../auth/jwt-refresh-token.strategy';
import { JwtStrategy } from '../auth/jwt.strategy';
import { GoogleStrategy } from '../auth/Google.strategy';
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: '1 day', 
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
    GoogleStrategy
  ],
})
export class AuthModule {}
