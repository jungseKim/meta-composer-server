import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { faker } from "@faker-js/faker";
import { Lesson, LessonType } from "../../entities/lesson.entity";
import { Teacher } from "../../entities/teacher.entity";
import axios, { AxiosResponse } from "axios";
export class CreateInitialZTeacherData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    for (let count = 0; count <= 3; count++) {
      const ImageURL = await axios
        .get("https://source.unsplash.com/featured/?piano")
        .then((data) => {
          console.log(data.request.res.req._redirectable._options.href);
          return data.request.res.req._redirectable._options.href;
        });

      const today = new Date();
      const mili = today.getMilliseconds();
      const alreadyUserId = await connection
        .getRepository(Teacher)
        .createQueryBuilder("teacher")
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
            imageURL: ImageURL + "",
            introduce: faker.lorem.sentences(),
            length: "00:50:00",
            price: faker.commerce.price(),
            name: faker.lorem.words(),
            type: LessonType.ETUDES,
            teacherId: trueNum,
          },
        ])
        .execute();
    }
  }
}
