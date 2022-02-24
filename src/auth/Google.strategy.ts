import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
import { JoinFacebookDto } from 'src/user/dto/join-facebook-user.dto';
import { randomUUID } from 'crypto';
import { Profile } from 'passport';
import { UserService } from 'src/user/user.service';
import { Faker } from '@faker-js/faker';

config();
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(private usersService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:4000/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate (
    accessToken: string,
     refreshToken: string,
      profile: Profile, done: VerifyCallback): Promise<any>
       {  const { name, emails } = profile;
           const joinFacebookDto:JoinFacebookDto = {
      email: emails[0].value,
      username: name.givenName+name.familyName,
      password:'123',
      provider: profile.provider,
      provider_id: +profile.id,
    };

    const user = this.usersService.findOrCreate(joinFacebookDto);
    done(null, user);
  }
}