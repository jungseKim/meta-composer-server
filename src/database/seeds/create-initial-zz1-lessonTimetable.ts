import { Lesson } from "../../entities/lesson.entity";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { User } from "../../entities/user.entity";
import { ChatRoom } from "../../entities/chatRoom.entity";
import { Message } from "../../entities/message.entity";
import { faker } from "@faker-js/faker";
import { Signup } from "../../entities/signup.entity";
import { CustomNotification } from "../../entities/custom-notification.entity";
import { Comment } from "../../entities/comment.entity";
import { TimeTable } from "../../entities/timeTable.entity";
import { Day } from "../../entities/timeTable.entity";
export class Notification implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    for (let count = 0; count < 7; count++) {
      const lessons = await connection
        .getRepository(Lesson)
        .createQueryBuilder("lesson")
        .getMany();
      const lesson = lessons[Math.floor(Math.random() * lessons.length)];

      for (let i = 0; i < 3; i++) {
        await connection
          .createQueryBuilder()
          .insert()
          .into(TimeTable)
          .values([
            {
              lesson: lesson,
              day: Day[days[count]],
              time: "01:00:00",
            },
          ])
          .execute();
      }
    }
  }
}
