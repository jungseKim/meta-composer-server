import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../entities/user.entity';
import { faker } from '@faker-js/faker';
import { Teacher } from '../../entities/teacher.entity';
import { Lesson } from '../../entities/lesson.entity';

export class CreateInitialZTeacherData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    //  const checkStart = await connection
    //    .getRepository(User)
    //    .createQueryBuilder('user')
    //    .where('user.id = :id', {
    //      id: 1,
    //    })
    //    .getOne();

    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          email: faker.internet.email(),
          password: faker.animal.type(),
          username: faker.name.firstName(),
        },
      ])
      .execute();

    const allUsers = await connection
      .getRepository(User)
      .createQueryBuilder('user')
      .getMany();

    // allUsers에서 랜덤으로 하나 선택
    // const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];

    const allUsersIds = allUsers.map((x) => x.id);

    const alreadyTeacherUserId = await connection
      .getRepository(Teacher)
      .createQueryBuilder('teacher')
      .getMany();

    const alreadyTeacherUserIds = alreadyTeacherUserId.map((x) => x.id);

    const difference = allUsersIds.filter(
      (x) => !alreadyTeacherUserIds.includes(x),
    );

    let trueNum = Math.floor(Math.random() * difference.length);
    try {
      if (!difference.includes(trueNum)) {
        while (difference.includes(trueNum)) {
          trueNum = Math.floor(Math.random() * difference.length);
        }

        await connection
          .createQueryBuilder()
          .insert()
          .into(Teacher)
          .values([
            {
              career: faker.company.companyName(),
              introduce: faker.lorem.words(),
              self_video: faker.internet.url(),
              userId: 1 + trueNum,
            },
          ])
          .execute();
      } else {
        await connection
          .createQueryBuilder()
          .insert()
          .into(Teacher)
          .values([
            {
              career: faker.company.companyName(),
              introduce: faker.lorem.words(),
              self_video: faker.internet.url(),
              userId: 1 + trueNum,
            },
          ])
          .execute();
      }
    } catch (error) {
      return;
    }
  }
}
//asd