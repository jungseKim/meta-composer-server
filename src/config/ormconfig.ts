import { LessonRoom } from "../entities/lessonRoom.entity";
import { Teacher } from "../entities/teacher.entity";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import dotenv from "dotenv";
import { Lesson } from "../entities/lesson.entity";
import { TimeTable } from "../entities/timeTable.entity";
import { Part } from "../entities/part.entity";
import { Assignment } from "../entities/assignment.entity";
import { Attendance } from "../entities/attendance.entity";
import { ChatRoom } from "../entities/chatRoom.entity";
import { Message } from "../entities/message.entity";
import { Payment } from "../entities/payment.entity";
import { Sheet } from "../entities/sheet.entity";
import { Signup } from "../entities/signup.entity";
import { Signuptimetable } from "../entities/signuptimetable.entity";
import { Wishlist } from "../entities/wishlist.entity";
import { Category } from "../entities/category.entity";
import { Comment } from "../entities/comment.entity";
import { CustomNotification } from "../entities/custom-notification.entity";
import { ConcoursSignup } from "../entities/concoursSignup.entity";
import { Concours } from "../entities/concours.entity";
import { ViewCount } from "../entities/viewCount.entity";
import { SearchHistory } from "../entities/searchHistory.entiry";

dotenv.config();

const ORMConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "nest",
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
    Signuptimetable,
    TimeTable,
    User,
    Wishlist,
    CustomNotification,
    Category,
    LessonRoom,
    ConcoursSignup,
    Concours,
    Notification,
    ViewCount,
    SearchHistory,

  ],
  timezone: "Z",
  synchronize: true, // false 기본값
  charset: "utf8mb4",
  autoLoadEntities: true,
  // logging: true,
  keepConnectionAlive: true,
  migrations: [__dirname + "/./src/migrations/*.ts"],
  cli: { migrationsDir: "./src/migrations" },
};
export default ORMConfig;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY0OTI5NDMxMCwiZXhwIjo4ODA0OTI5NDMxMH0.umV5UCzbL3oD4JpjoIr8mR7l4SWn2t4klmfNq518fdY;
