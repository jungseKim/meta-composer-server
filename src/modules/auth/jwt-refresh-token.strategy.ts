import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { TokenPayload } from './token-payload.interface';
let cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['token'] || req.header;
  }
  return token;
};
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
      // passReqToCallback: true,
      // true로 할 시에 validate 함수의 인자로 request 객체가 전달됨
    });
  }

  async validate(payload: TokenPayload, done: VerifiedCallback): Promise<void> {
    const user = await this.userRepository.findOne(payload['userId']);

    done(null, user);
  }
}
