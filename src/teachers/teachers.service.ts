import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/entities/teacher.entity';
import { User } from 'src/entities/user.entity';
import { TeachersRepository } from './teachers.repository';

@Injectable()
export class TeachersService {

    constructor(@InjectRepository(TeachersRepository)
    private teachersRepository : TeachersRepository){}


      async registerTeacher(user : User,updateData): Promise<Teacher> {
        return this.teachersRepository.registerTeacher(user,updateData);
      }

}
