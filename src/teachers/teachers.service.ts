import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Teacher} from 'src/entities/teacher.entity';
import {User} from 'src/entities/user.entity';
import {UserService} from 'src/user/user.service';
import {getConnection} from 'typeorm';
import { TeacherDTO } from './dto/teachers.dto';
import {TeachersRepository} from './teachers.repository';

@Injectable()
export class TeachersService {
    constructor(
        @InjectRepository(TeachersRepository)private teachersRepository : TeachersRepository
    ) {}

    async registerTeacher(user : User, updateData:TeacherDTO): Promise<Teacher> {

        return this
            .teachersRepository
            .registerTeacher(user, updateData);
    }



    async updateTeacherInfo(user : User, updateData:TeacherDTO): Promise<Teacher> {

        const teacher = await getConnection()
            .createQueryBuilder(Teacher, "teacher")
            .where("userId = :uid", {uid: user.id})
            .getOne();
        if(teacher.career != updateData.career){
        teacher.career = updateData.career;
        }
        if( teacher.introduce != updateData.introduce){
        teacher.introduce = updateData.introduce;
        }
        if(  teacher.self_video != updateData.self_video){
        teacher.self_video = updateData.self_video;
        }
    
        console.log(teacher);
      
        await this
            .teachersRepository
            .save(teacher);
        return teacher;
    }

    async findAllTeachers(){
        return this.teachersRepository.findAllTeachers();
    }
}