import { imageOption } from "src/lib/imageOption";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/entities/user.entity";
import { ProfileDto } from "src/types/Profile";
import { TokenPayload } from "./token-payload.interface";
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  public getJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: 60 * 60 * 1000 * 24 * 1000,
    });

    return token;
  }
  public getJwtAccessToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: 60 * 60 * 1000,
    });
    return token;
  }
  public async userProfileUpdate(user: User, image, data: ProfileDto) {
    user.username = data.username;
    user.self_introduce = data.self_introduce;
    if (image) {
      if (process.env.NODE_ENV === "dev") {
        user.profile_image = `http://localhost:4000/${image.filename}`;
      } else {
        user.profile_image = "https://jungse.shop" + image.filename;
      }
    }
    await user.save();
    return user;
  }
}
