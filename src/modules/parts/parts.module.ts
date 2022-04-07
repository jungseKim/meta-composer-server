import { Module } from "@nestjs/common";
import { PartsService } from "./parts.service";
import { PartsController } from "./parts.controller";
import { PartsRepository } from "./parts.repository";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([PartsRepository])],
  providers: [PartsService],
  controllers: [PartsController],
})
export class PartsModule {}
