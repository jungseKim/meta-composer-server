import { UserService } from "src/modules/user/user.service";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { User } from "../../entities/user.entity";
import { faker } from "@faker-js/faker";
export class CreateInitialUserData implements Seeder {
  constructor(private userService: UserService) {}
  public async run(factory: Factory, connection: Connection): Promise<any> {
    for (let count = 0; count <= 5; count++) {
      const today = new Date();
      const mili = today.getMilliseconds();
      await connection
        .getRepository(User)
        .createQueryBuilder("user")
        .insert()
        .into(User)
        .values([
          {
            email: faker.datatype.number() + faker.internet.email(),
            // password: faker.animal.type(),
            username:
              faker.name.lastName() +
              faker.name.middleName() +
              faker.name.firstName() +
              mili,
            provider_id:
              "GENERATED_BY_SEEDER_RAMDOM ID=" +
              faker.address.cityName() +
              mili,
          },
        ])
        .execute();
    }
  }
}
