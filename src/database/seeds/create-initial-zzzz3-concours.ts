import { Concours } from "../../entities/concours.entity";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { faker } from "@faker-js/faker";

export class CreateInitialConcoursData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const days = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24,
    ];
    const hours = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23,
    ];
    const mins = [10, 40];
    for (let count = 0; count <= 3; count++) {
      const month = months[Math.floor(Math.random() * months.length)];
      const day = days[Math.floor(Math.random() * days.length)];
      const hour = hours[Math.floor(Math.random() * hours.length)];
      const min = mins[Math.floor(Math.random() * mins.length)];
      const today = new Date();
      const mili = today.getMilliseconds();

      await connection
        .createQueryBuilder()
        .insert()
        .into(Concours)
        .values([
          {
            minimum_starting_people: +9,
            coverIMG_url: faker.image.avatar(),
            title: faker.company.companyName() + mili,
            contents: faker.lorem.words(),
            concoursSignupStartTime:
              "2022-" + month + "-" + day + " " + hour + ":" + min + ":00",
            concoursSignupFinishTime:
              "2022-" +
              month +
              "-" +
              (day + 1) +
              " " +
              hour +
              ":" +
              min +
              ":00",
            finishTime:
              "2022-" +
              month +
              "-" +
              (day + 4) +
              " " +
              hour +
              ":" +
              min +
              ":00",
            startTime:
              "2022-" +
              month +
              "-" +
              (day + 2) +
              " " +
              hour +
              ":" +
              min +
              ":00",

            price: +faker.commerce.price(),
          },
        ])
        .execute();
    }
  }
}
