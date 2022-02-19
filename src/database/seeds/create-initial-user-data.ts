import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../entities/user.entity';
import { faker } from '@faker-js/faker';
import { Teacher } from '../../entities/teacher.entity';
import { Lesson } from '../../entities/lesson.entity';
import { Logger } from '@nestjs/common';
export class CreateInitialUserData implements Seeder {
  private readonly logger = new Logger(CreateInitialUserData.name);
  public async run(factory: Factory, connection: Connection): Promise<void> {
    // const checkStart = await connection
    //   .getRepository(User)
    //   .createQueryBuilder('user')
    //   .where('user.id = :id', {
    //     id: 1,
    //   })
    //   .getOne();
    // await connection
    //   .createQueryBuilder()
    //   .insert()
    //   .into(User)
    //   .values([
    //     {
    //       email: faker.internet.email(),
    //       password: faker.animal.type(),
    //       username: faker.name.firstName(),
    //     },
    //   ])
    //   .execute();
    // const allUserId = await connection
    //   .getRepository(User)
    //   .createQueryBuilder('user')
    //   .getMany();
    // if (allUserId.length == 0) {
    //   allUserId.length = 1;
    // }
    // const alreadyUserId = await connection
    //   .getRepository(User)
    //   .createQueryBuilder('user')
    //   .where('user.id = :id', {
    //     id: Math.floor(Math.random() * allUserId.length),
    //   })
    //   .getOne();
    // if (!checkStart) {
    //   alreadyUserId.id = 1;
    // }
    // if (!allUserId.includes(alreadyUserId)) {
    //   await connection
    //     .createQueryBuilder()
    //     .insert()
    //     .into(Teacher)
    //     .values([
    //       {
    //         career: faker.company.companyName(),
    //         introduce: faker.lorem.words(),
    //         self_video: faker.internet.url(),
    //         userId: alreadyUserId.id,
    //       },
    //     ])
    //     .execute();
    // }

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
  }
}
