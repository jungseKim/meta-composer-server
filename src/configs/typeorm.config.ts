import { Teacher } from './../entities/teacher.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import dotenv from 'dotenv';

dotenv.config({});

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'nest',
  entities: [User, Teacher],
  synchronize: false, // false 기본값
  autoLoadEntities: true,
  logging: true,
  keepConnectionAlive: true,
};
