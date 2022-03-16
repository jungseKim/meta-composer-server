import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { User } from "../../entities/user.entity";
import { ChatRoom } from "../../entities/chatRoom.entity";
import { Lesson } from "../../entities/lesson.entity";

export class CreateInitialChatRoomData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    for (let count = 0; count <= 3; count++) {
      const allUsers = await connection
        .getRepository(User)
        .createQueryBuilder("user")
        .getMany();
      const allUserIds = allUsers.map((x) => x.id);

      const allLessons = await connection
        .getRepository(Lesson)
        .createQueryBuilder("lesson")
        .getMany();
      const allLessonIds = allLessons.map((x) => x.id);

      const randomUser =
        allUserIds[Math.floor(Math.random() * allUserIds.length)];
      const randomLesson =
        allLessonIds[Math.floor(Math.random() * allLessonIds.length)];

      await connection
        .createQueryBuilder()
        .insert()
        .into(ChatRoom)
        .values([
          {
            userId: randomUser,
            lessonId: randomLesson,
          },
        ])
        .execute();

      if (
        !(
          allLessonIds.includes(randomLesson) && allUserIds.includes(randomUser)
        )
      ) {
        await connection
          .createQueryBuilder()
          .insert()
          .into(ChatRoom)
          .values([
            {
              userId: randomUser,
              lessonId: randomLesson,
            },
          ])
          .execute();
      }
    }
  }
}
