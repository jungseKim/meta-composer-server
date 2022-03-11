import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SheetsController } from './sheets.controller';
import SheetsRepository from './sheets.repository';
import { SheetsService } from './sheets.service';

@Module({

  imports : [TypeOrmModule.forFeature([SheetsRepository])],
  controllers: [SheetsController],
  providers: [SheetsService]
})
export class SheetsModule {}
