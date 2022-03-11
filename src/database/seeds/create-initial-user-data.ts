import { UserService } from 'src/user/user.service';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../entities/user.entity';
import { faker } from '@faker-js/faker';

export class CreateInitialUserData implements Seeder {
  constructor(private userService: UserService) {}
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
    .createQueryBuilder()
    .insert()
    .into(User)
    .values([
      {
        email: faker.internet.email(),
        password: faker.animal.type(),
        username: faker.name.firstName(),
        provider_id: "GENERATED_BY_SEEDER_RAMDOM ID="+faker.address.cityName()
      },
    ])
    .execute();
}
}
