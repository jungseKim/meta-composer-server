import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SignupsController } from "./signups.controller";
import { SignupsRepository } from "./signups.repository";
import { SignupsService } from "./signups.service";

@Module({
  imports: [TypeOrmModule.forFeature([SignupsRepository])],
  providers: [SignupsService],
  controllers: [SignupsController],
})
export class SignupsModule {} //asd
