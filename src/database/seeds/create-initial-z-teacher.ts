import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../entities/user.entity';
import { faker } from '@faker-js/faker';
import { Teacher } from '../../entities/teacher.entity';
import { Lesson } from '../../entities/lesson.entity';
import { Logger } from '@nestjs/common';
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

    const allUserId = await connection
      .getRepository(User)
      .createQueryBuilder('user')

      .getMany();

    const allUserIds = allUserId.map((x) => x.id);

    const alreadyUserId = await connection
      .getRepository(Teacher)
      .createQueryBuilder('teacher')

      .getMany();

    const alreadyUserIds = alreadyUserId.map((x) => x.id);

    const difference = allUserIds.filter((x) => !alreadyUserIds.includes(x));
    //difference  에 trueNum이 포함된 값이 맞을때까지
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
