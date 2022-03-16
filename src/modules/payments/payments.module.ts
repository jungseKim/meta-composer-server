import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsRepository } from './payments.repository';

@Module({
  imports : [TypeOrmModule.forFeature([PaymentsRepository])],
  providers: [PaymentsService],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
