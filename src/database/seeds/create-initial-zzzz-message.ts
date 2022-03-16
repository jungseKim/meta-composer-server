import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { User } from "../../entities/user.entity";
import { ChatRoom } from "../../entities/chatRoom.entity";
import { Message } from "../../entities/message.entity";
import { faker } from "@faker-js/faker";

export class CreateInitialMessageData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    for (let count = 0; count <= 10; count++) {
      const allUsers = await connection
        .getRepository(User)
        .createQueryBuilder("user")
        .getMany();

      const sender = allUsers[Math.floor(Math.random() * allUsers.length)];

      const allchatRooms = await connection
        .getRepository(ChatRoom)
        .createQueryBuilder("chat_room")
        .getMany();
      const allchatRoomIds = allchatRooms.map((x) => x.id);

      await connection
        .createQueryBuilder()
        .insert()
        .into(Message)
        .values([
          {
            message: faker.lorem.words(),
            chatRoomId:
              allchatRoomIds[Math.floor(Math.random() * allchatRoomIds.length)],
            is_read: false,
            sender: sender,
          },
        ])
        .execute();
    }
  }
}
