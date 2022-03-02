import { User } from './../../entities/user.entity';
import { SetupService } from './setup.service';
import { Module } from '@nestjs/common';
import { SetupGateway } from './setup.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [SetupService, SetupGateway, SetupService],

  imports: [TypeOrmModule.forFeature([User])],
  exports: [SetupService],
})
export class SetupModule {}
