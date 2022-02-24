import { SetupService } from './setup.service';
import { Module } from '@nestjs/common';
import { SetupGateway } from './setup.gateway';

@Module({
  providers: [SetupService, SetupGateway, SetupService],
})
export class SetupModule {}
