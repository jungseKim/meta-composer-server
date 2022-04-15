import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { User } from "../../entities/user.entity";
import { ChatRoom } from "../../entities/chatRoom.entity";
import { faker } from "@faker-js/faker";
import { Signup } from "../../entities/signup.entity";

export class CreateInitialSignupData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    for (let count = 0; count <= 3; count++) {
      const allUsers = await connection
        .getRepository(User)
        .createQueryBuilder("user")
        .getMany();
      const allUsersIds = allUsers.map((x) => x.id);

      //   const allUsersIds = allUsers[Math.floor(Math.random() * allUsers.length)];

      const allLesson = await connection
        .getRepository(ChatRoom)
        .createQueryBuilder("chat_room")
        .getMany();
      const allLessonIds = allLesson.map((x) => x.id);

      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const date = today.getDate();
      const day = today.getDay();

      // const randomHours = [];
      // for (let y = 0; (y = 23); y++) {
      //   randomHours.push(y);
      // }
      // const randomMins = [];
      // for (let y = 0; (y = 59); y++) {
      //   randomMins.push(y);
      // }

      // const randomHour =
      //   randomHours[Math.floor(Math.random() * randomHours.length)];
      // const randomMin =
      //   randomMins[Math.floor(Math.random() * randomMins.length)];
      await connection
        .createQueryBuilder()
        .insert()
        .into(Signup)
        .values([
          {
            merchant_uid: faker.lorem.words(),
            lessonId:
              allLessonIds[Math.floor(Math.random() * allLessonIds.length)],
            userId: allUsersIds[Math.floor(Math.random() * allUsersIds.length)],
            startdate: year + "-" + month + "-" + date,
            weekdays: faker.date.weekday(),
            howManyMonth: 5,
            // lessonTime: randomHour + ":" + randomMin + ":" + randomMin,
            lessonTime: "14:30:00",
          },
        ])
        .execute();
    }
  }
}
