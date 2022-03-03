import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersController } from './teachers.controller';
import { TeachersRepository } from './teachers.repository';
import { TeachersService } from './teachers.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeachersRepository])],
  controllers: [TeachersController],
  providers: [TeachersService,]
})
export class TeachersModule {}
