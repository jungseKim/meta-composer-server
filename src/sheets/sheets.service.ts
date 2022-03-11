import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sheet } from 'src/entities/sheet.entity';
import { User } from 'src/entities/user.entity';
import SheetsRepository from './sheets.repository';

@Injectable()
export class SheetsService {
    constructor(
        @InjectRepository(SheetsRepository)
        private sheetsRepository: SheetsRepository, //
      ) {}

      async uploadSheets(updateData,user:User):Promise<Sheet>{

          return this.sheetsRepository.uploadSheets(updateData,user);
      }


     
}
