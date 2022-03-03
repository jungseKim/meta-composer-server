import { Teacher } from '../entities/teacher.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import dotenv from 'dotenv';
import { Lesson } from '../entities/lesson.entity';
import { TimeTable } from '../entities/timeTable.entity';
import { Part } from '../entities/part.entity';
import { Assignment } from '../entities/assignment.entity';
import { Attendance } from '../entities/attendance.entity';
import { ChatRoom } from '../entities/chatRoom.entity';
import { Message } from '../entities/message.entity';
import { Payment } from '../entities/payment.entity';
import { Sheet } from '../entities/sheet.entity';
import { Signup } from '../entities/signup.entity';
import { Signupschedule } from '../entities/signupschedule.entity';
import { Signuptimetable } from '../entities/signuptimetable.entity';
import { Wishlist } from '../entities/wishlist.entity';
import { Category } from '../entities/category.entity';
import { Comment } from '../entities/comment.entity';
import { Notification } from '../entities/notification.entity';

dotenv.config();

 const ORMConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'nest',
  entities: [ 
     User,
    Teacher,
    Lesson,
    TimeTable,
    Part,
    Comment,
    Assignment,
    Attendance,
    ChatRoom,
    Message,
    Part,
    Payment,
    Sheet,
    Signup,
    Signupschedule,
    Signuptimetable,
    TimeTable,
    User,
    Wishlist,
    Notification,
    Category,
  ],

  synchronize: false, // false 기본값
  charset: 'utf8mb4',
  autoLoadEntities: true,
  logging: true,
  keepConnectionAlive: true,
  migrations: [__dirname + '/./src/migrations/*.ts'],
  cli: { migrationsDir: './src/migrations' },

};

export default ORMConfig;
