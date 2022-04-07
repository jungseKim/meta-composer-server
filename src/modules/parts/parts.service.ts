import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Part } from "src/entities/part.entity";
import { PartsRepository } from "./parts.repository";

@Injectable()
export class PartsService {
  constructor(
    @InjectRepository(PartsRepository)
    private partssRepository: PartsRepository, //
  ) {}
  async createPart(): Promise<Part[]> {
    return this.partssRepository.createPart();
  }
}
