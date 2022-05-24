import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { AuthModule } from "../auth/auth.module";
import { AuthService } from "../auth/auth.service";
import { GoogleStrategy } from "../auth/Google.strategy";
import { JwtRefreshTokenStrategy } from "../auth/jwt-refresh-token.strategy";
import { JwtStrategy } from "../auth/jwt.strategy";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { AdminController } from "./admin.controller";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: "1 day",
      },
    }),
  ],
  controllers: [AdminController],
  providers: [AuthService],
})
export class AdminModule {}
