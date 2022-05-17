import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Concours } from "src/entities/concours.entity";
import { Repository } from "typeorm";
import { YoutubesController } from "./youtubes.controller";
import { YoutubesService } from "./youtubes.service";

@Module({
  controllers: [YoutubesController],
  providers: [YoutubesService],
})
export class YoutubesModule {}
