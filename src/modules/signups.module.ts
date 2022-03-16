import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignupsController } from '../signups/signups.controller';
import { SignupsRepository } from '../signups/signups.repository';
import { SignupsService } from '../signups/signups.service';

@Module({
    imports: [TypeOrmModule.forFeature([SignupsRepository])],
    providers: [SignupsService],
    controllers: [SignupsController],
  })
  export class SignupsModule {}//asd
