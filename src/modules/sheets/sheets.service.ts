import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Sheet } from "src/entities/sheet.entity";
import { User } from "src/entities/user.entity";
import SheetsRepository from "./sheets.repository";

@Injectable()
export class SheetsService {
  constructor(
    @InjectRepository(SheetsRepository)
    private sheetsRepository: SheetsRepository, //
  ) {}

  async uploadSheets(user: User, sheet, updateData): Promise<Sheet> {
    return this.sheetsRepository.uploadSheets(user, sheet, updateData);
  }
}
