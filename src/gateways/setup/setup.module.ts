import { SocketUserData } from 'src/common/interceptors/socketUserData.interceptor';
import { SetupService } from './setup.service';
import { Module } from '@nestjs/common';
import { SetupGateway } from './setup.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import ORMConfig from 'src/config/ormconfig';
import { User } from 'src/entities/user.entity';
import { LessonRoom } from 'src/entities/lessonRoom.entity';

@Module({
  providers: [SetupService, SetupGateway, SetupService, SocketUserData],
  imports: [TypeOrmModule.forFeature([User, LessonRoom])],
})
export class SetupModule {}
