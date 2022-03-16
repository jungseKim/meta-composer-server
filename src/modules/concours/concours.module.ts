import { Module } from "@nestjs/common";
import { ConcoursService } from "./concours.service";
import { ConcoursController } from "./concours.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConcoursRepository } from "./concours.repository";

@Module({
  imports: [TypeOrmModule.forFeature([ConcoursRepository])],
  providers: [ConcoursService],
  controllers: [ConcoursController],
})
export class ConcoursModule {}
