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
  async finAll(): Promise<Array<User>> {
    const users = await this.userRepository.find();
    return users;
  }
  async findOne(userId: number): Promise<User> {
    const user = await this.userRepository.findOne(userId);
    return user;
  }
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
        profile_image : joinFacebookDto.profile_image,

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
}