import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { JoinFacebookDto } from 'src/user/dto/join-facebook-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private usersService: UserService) {
    super({
      clientID: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
      callbackURL: 'https://jungse.shop/api/auth/facebook/redirect',
      scope: 'email',
      profileFields: ['emails', 'name'],
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
      provider: profile.provider,
      provider_id: +profile.id,
      password: 'facebook',
    };
    const user = this.usersService.findOrCreate(joinFacebookDto);

    done(null, user);
  }
}
