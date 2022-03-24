import { LessonClassModule } from "./gateways/lesson-class/lesson-class.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { NotificationModule } from "./gateways/notification/notification.module";
import { ChatModule } from "./gateways/chatGateway/chat.module";
import { PublicRoomModule } from "./gateways/publcRoom/publicroom.module";
import { SetupModule } from "./gateways/setup/setup.module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WebRtcGateway } from "./gateways/rtcGateway/web-rtc.gateway";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import ORMConfig from "./config/ormconfig";
import { RedisCacheModule } from "./cache/rediscache.module";
import { RoomModule } from "./modules/room/room.module";
import { UserModule } from "./modules/user/user.module";
import { LessonsModule } from "./modules/lessons/lessons.module";
import { SignupsModule } from "./modules/signups/signups.module";
import { TeachersModule } from "./modules/teachers/teachers.module";
import { CommentsModule } from "./modules/comments/comments.module";
import { AssignmentsModule } from "./modules/assignments/assignments.module";
import { WishlistsModule } from "./modules/wishlists/wishlists.module";
import { SheetsModule } from "./modules/sheets/sheets.module";
import { PaymentsModule } from "./modules/payments/payments.module";
import { ConcoursModule } from "./modules/concours/concours.module";
import { ConcoursSignupsModule } from "./modules/concours-signups/concours-signups.module";
import { ScheduleModule } from "@nestjs/schedule";
import { Signup } from "./entities/signup.entity";
import { YoutubesModule } from "./modules/youtubes/youtubes.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

@Module({
  controllers: [AppController],
  providers: [AppService, WebRtcGateway],
  imports: [
    LessonClassModule,
    ScheduleModule.forRoot(),
    TasksModule,
    NotificationModule,
    ChatModule,
    RedisCacheModule,
    PublicRoomModule,
    AuthModule,
    RoomModule,
    SetupModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    TypeOrmModule.forRoot(ORMConfig),
    UserModule,
    LessonsModule,
    SignupsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: "6000s" },
    }),
    TeachersModule,
    CommentsModule,
    AssignmentsModule,
    WishlistsModule,
    SheetsModule,
    PaymentsModule,
    ConcoursModule,
    ConcoursSignupsModule,
    YoutubesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
  ],
})
export class AppModule {}
