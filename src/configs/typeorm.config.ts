import { Teacher } from './../entities/teacher.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'bi700523',
  database: 'nest',
  entities: [User, Teacher],
  synchronize: true, // false 기본값
  autoLoadEntities: true,
  logging: true,
  keepConnectionAlive: true,
};
