import { Teacher } from 'src/entities/teacher.entity';
import { User } from 'src/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';


@EntityRepository(Teacher)
export class TeachersRepository extends Repository<Teacher> {
  async registerTeacher(user:User, updateData): Promise<Teacher> {
  

    const registeredTeacher = this.create({
      career : updateData.career,
      introduce : updateData.introduce,
      self_video : updateData.self_video,
      userId : user.id
    });

    await this.save(registeredTeacher);
    
    return registeredTeacher;
  }
}