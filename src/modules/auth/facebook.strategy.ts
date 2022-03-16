import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";
import { JoinFacebookDto } from "src/modules/user/dto/join-facebook-user.dto";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, "facebook") {
  constructor(private usersService: UserService) {
    super({
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: "https://jungse.shop/api/auth/facebook/redirect",
      scope: "email",
      profileFields: ["emails", "name"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails } = profile;
    const joinFacebookDto: JoinFacebookDto = {
      username: name.givenName + name.familyName,
      email: emails[0].value,
      password: "",
      provider: profile.provider,
      provider_id: profile.id,
      profile_image: profile.photos[0].value.toString(),
    };
    const user = this.usersService.findOrCreate(joinFacebookDto);

    done(null, user);
  }
}
