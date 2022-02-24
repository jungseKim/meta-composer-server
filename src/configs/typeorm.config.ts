import { Teacher } from './../entities/teacher.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'jungse',
  password: 'jungse123',
  database: 'nest',
  entities: [User, Teacher],
  synchronize: false, // false 기본값
  autoLoadEntities: true,
  logging: true,
  keepConnectionAlive: true,
};
