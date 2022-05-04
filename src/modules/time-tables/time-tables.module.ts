import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TimeTablesController } from "./time-tables.controller";
import { TimeTablesRepository } from "./time-tables.repository";
import { TimeTablesService } from "./time-tables.service";

@Module({
  imports: [TypeOrmModule.forFeature([TimeTablesRepository])],
  controllers: [TimeTablesController],
  providers: [TimeTablesService],
  exports: [TimeTablesService],
})
export class TimeTablesModule {}
