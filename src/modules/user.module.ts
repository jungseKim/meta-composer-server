import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Module({})
export class UserModule {
  providers: [UserService];
  //   exports: [UserService];
}
