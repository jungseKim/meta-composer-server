import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDecorator } from 'src/decorators/user.decorator';
import { Teacher } from 'src/entities/teacher.entity';
import { User } from 'src/entities/user.entity';
import { TeachersRepository } from './teachers.repository';
import { TeachersService } from './teachers.service';
import {getConnection} from "typeorm";

@Controller('api/teachers')
@ApiTags('강사 API')
export class TeachersController {
    constructor(private teachersSerice : TeachersService, private teachersRepository : TeachersRepository){}

        @UseGuards(AuthGuard('jwt'))
        @Post()
        @ApiOperation({summary: '강사 등록', description: '강사를 등록한다'})
        @ApiResponse({status: 200, description: '강사 등록 완료', type: Teacher})
        registerTeacher(@UserDecorator()user : User , @Body() updateData):Promise<Teacher>{
            return  this.teachersSerice.registerTeacher(user,updateData);
        }

        @UseGuards(AuthGuard('jwt'))
        @Delete()
        @ApiOperation({summary: '강사 등록 취소'})
        @ApiResponse({status: 200, description: '강사 등록 취소 완료', type: Teacher})
        async unRegisterTeacher(@UserDecorator()user : User ){
            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(Teacher)
                .where("userId = :id", { id: user.id })
                .execute();
        }
    
}
