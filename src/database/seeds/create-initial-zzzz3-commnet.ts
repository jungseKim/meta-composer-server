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

export class CommentData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    for (let count = 0; count <= 100; count++) {
      const allLesson = await connection
        .getRepository(ChatRoom)
        .createQueryBuilder("chat_room")
        .getMany();
      // const allLessonIds = allLesson.map((x) => x.id);
      const allUsers = await connection
        .getRepository(User)
        .createQueryBuilder("user")
        .getMany();

      const user = allUsers[Math.floor(Math.random() * allUsers.length)];

      await connection
        .createQueryBuilder()
        .insert()
        .into(Comment)
        .values([
          {
            user: user,
            lesson: allLesson[Math.floor(Math.random() * allLesson.length)],
            rating: 1,
            contents: faker.lorem.words(),
          },
        ])
        .execute();
    }
  }
}
