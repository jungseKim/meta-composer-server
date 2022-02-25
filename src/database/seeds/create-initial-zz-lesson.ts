import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { Lesson, LessonType } from '../../entities/lesson.entity';
import { Teacher } from '../../entities/teacher.entity';

export class CreateInitialZTeacherData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    const alreadyUserId = await connection
      .getRepository(Teacher)
      .createQueryBuilder('teacher')
      .getMany();

    const alreadyUserIds = alreadyUserId.map((x) => x.id);
    const trueNum =
      alreadyUserIds[Math.floor(Math.random() * alreadyUserIds.length)];
    await connection
      .createQueryBuilder()
      .insert()
      .into(Lesson)
      .values([
        {
          introduce: faker.internet.email(),
          length: '00:30:00',
          price: faker.commerce.price(),
          name: faker.name.findName(),
          type: LessonType.ETUDES,
          teacherId: trueNum,
        },
      ])
      .execute();
  }
}
//asd