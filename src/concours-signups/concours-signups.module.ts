import { Module } from '@nestjs/common';
import { ConcoursSignupsService } from './concours-signups.service';
import { ConcoursSignupsController } from './concours-signups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcoursSignupsRepository } from './concours-signups.repository';

@Module({
imports:[TypeOrmModule.forFeature([ConcoursSignupsRepository])],
  providers: [ConcoursSignupsService],
  controllers: [ConcoursSignupsController]
})
export class ConcoursSignupsModule {}
