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

export class Notification implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    for (let count = 0; count <= 100; count++) {
      const allUsers = await connection
        .getRepository(User)
        .createQueryBuilder("user")
        .getMany();

      const user = allUsers[Math.floor(Math.random() * allUsers.length)];
      if (count % 2 == 0) {
        const allsignup = await connection
          .getRepository(Signup)
          .createQueryBuilder("signup")
          .getMany();

        const signup = allsignup[Math.floor(Math.random() * allsignup.length)];

        await connection
          .createQueryBuilder()
          .insert()
          .into(CustomNotification)
          .values([
            {
              userId: user.id,
              type: "signup",
              typeId: signup.id,
              content: `${user.username} 님이 강의를 수강했습니다.`,
            },
          ])
          .execute();
      } else {
        const allCommnet = await connection
          .getRepository(Comment)
          .createQueryBuilder("comment")
          .getMany();

        const comment =
          allCommnet[Math.floor(Math.random() * allCommnet.length)];

        await connection
          .createQueryBuilder()
          .insert()
          .into(CustomNotification)
          .values([
            {
              userId: user.id,
              type: "commnet",
              typeId: comment.id,
              content: `${user.username} 님이 댓글을 달았습니다.`,
            },
          ])
          .execute();
      }
    }
  }
}
