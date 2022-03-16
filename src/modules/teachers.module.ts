import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersController } from '../teachers/teachers.controller';
import { TeachersRepository } from '../teachers/teachers.repository';
import { TeachersService } from '../teachers/teachers.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeachersRepository])],
  controllers: [TeachersController],
  providers: [TeachersService,]
})
export class TeachersModule {}
