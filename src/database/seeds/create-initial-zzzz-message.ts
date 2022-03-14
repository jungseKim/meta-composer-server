import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../entities/user.entity';
import { ChatRoom } from '../../entities/chatRoom.entity';
import { Message } from '../../entities/message.entity';
import { faker } from '@faker-js/faker';

export class CreateInitialMessageData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const allUsers = await connection
      .getRepository(User)
      .createQueryBuilder('user')
      .getMany();
    const allUserIds = allUsers.map((x) => x.id);

    const allchatRooms = await connection
      .getRepository(ChatRoom)
      .createQueryBuilder('chat_room')
      .getMany();
    const allchatRoomIds = allchatRooms.map((x) => x.id);

    for (let i = 0; i < 40; i++) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(Message)
        .values([
          {
            sender: 1,
            message: faker.lorem.words(),
            chatRoomId: 1,
          },
        ])
        .execute();
    }
  }
}