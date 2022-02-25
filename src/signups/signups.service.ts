import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Signup } from 'src/entities/signup.entity';
import { SignupsRepository } from './signups.repository';



@Injectable()
export class SignupsService {
  constructor(
    @InjectRepository(SignupsRepository)
    private signupsRepository: SignupsRepository, //
  ) {}

  async signup(id,merchant_uid): Promise<Signup> {
    return this.signupsRepository.signup(id,merchant_uid);
  }
}
