import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Concours } from "src/entities/concours.entity";
import { ConcoursRepository } from "./concours.repository";

@Injectable()
export class ConcoursService {
  constructor(
    @InjectRepository(ConcoursRepository)
    private concoursRepository: ConcoursRepository, //
  ) {}
  async showAllConcours(): Promise<Concours[]> {
    return this.concoursRepository.find();
  }

  async createConcours(updateData: Concours, image: any): Promise<Concours> {
    return this.concoursRepository.createConcours(updateData, image);
  }

  async getConcoursById(id: number) {
    return this.concoursRepository.findOne(id);
  }

  async deleteConcours(id: number) {
    await this.concoursRepository.delete(id);
  }
  async updateConcours(id: number, updateData: Concours, image: any) {
    await this.concoursRepository.updateConcours(id, updateData, image);
  }
}
