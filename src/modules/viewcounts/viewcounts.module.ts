import { Module } from "@nestjs/common";
import { ViewcountsService } from "./viewcounts.service";
import { ViewcountsController } from "./viewcounts.controller";
import { ViewcountsRepository } from "./viewcounts.repository";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ViewcountsRepository])],
  controllers: [ViewcountsController],
  providers: [ViewcountsService],
})
export class ViewcountsModule {}
