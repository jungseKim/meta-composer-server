import { UserService } from 'src/user/user.service';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../entities/user.entity';

export class CreateInitialUserData implements Seeder {
  constructor(private userService: UserService) {}
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const areadyUsers = await this.userService.finAll();
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([{ id: 4, username: 'temp' }])
      .execute();
  }
}
