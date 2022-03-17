import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { User } from "../../entities/user.entity";
import { ChatRoom } from "../../entities/chatRoom.entity";
import { Faker, faker } from "@faker-js/faker";
import { Signup } from "../../entities/signup.entity";
import { Signuptimetable } from "../../entities/signuptimetable.entity";

export class CreateInitialSignupData implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    for (let count = 0; count <= 3; count++) {
      const allSignups = await connection
        .getRepository(Signup)
        .createQueryBuilder("signup")
        .getMany();

      const signup = allSignups[Math.floor(Math.random() * allSignups.length)];

      const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const days = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28,
      ];
      const hours = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23,
      ];
      const mins = [10, 40];

      const month = months[Math.floor(Math.random() * months.length)];
      const day = days[Math.floor(Math.random() * days.length)];
      const hour = hours[Math.floor(Math.random() * hours.length)];
      const min = mins[Math.floor(Math.random() * mins.length)];

      await connection
        .createQueryBuilder()
        .insert()
        .into(Signuptimetable)
        .values([
          {
            time: "2022-" + month + "-" + day + " " + hour + ":" + min + ":00",
            signup: signup,
          },
        ])
        .execute();
    }
  }
}
