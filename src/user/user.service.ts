import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { JoinFacebookDto } from './dto/join-facebook-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOrCreate(joinFacebookDto: JoinFacebookDto) {
    const exUser = await this.userRepository.findOne({
      where: {
        provider: joinFacebookDto.provider,
        provider_id: joinFacebookDto.provider_id,
      },
    });
    if (exUser) return exUser;

    await this.userRepository.save(
      {
        provider_id: joinFacebookDto.provider_id,
        provider: joinFacebookDto.provider,
        username: joinFacebookDto.username,
        email: joinFacebookDto.email,
        password: joinFacebookDto.password,
      },
      { reload: false },
    );

    return this.userRepository.findOne({
      where: {
        provider: joinFacebookDto.provider,
        provider_id: joinFacebookDto.provider_id,
      },
    });
  }


  async findById(user : User) {


    return user;
    const exUser = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });
    if (exUser) return exUser;

    await this.userRepository.save(
      {
        provider_id: user.provider_id,
        provider: user.provider,
        username: user.username,
        email: user.email,
        password: user.password,
      },
      { reload: false },
    );

    // return this.userRepository.findOne({
    //   where: {
    //     provider: joinFacebookDto.provider,
    //     provider_id: joinFacebookDto.provider_id,
    //   },
    // });
  }
}
//asd