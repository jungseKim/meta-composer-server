import { Teacher } from '../entities/teacher.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Lesson } from '../entities/lesson.entity';
import { TimeTable } from '../entities/timeTable.entity';
import { Part } from '../entities/part.entity';
import { Comment } from '../entities/comment.entity';
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
import { Notification } from '../entities/notification.entity';
import { Category } from '../entities/category.entity';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1111',
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
    Comment,
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

  autoLoadEntities: true,
  charset: 'utf8mb4',
  synchronize: true,
  logging: true,
  keepConnectionAlive: true,
  migrations: [__dirname + '/./src/migrations/*.ts'],
  cli: { migrationsDir: './src/migrations' },
};
export default config;
