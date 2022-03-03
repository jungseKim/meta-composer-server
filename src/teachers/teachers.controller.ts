import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { UserDecorator } from 'src/decorators/user.decorator';
import { Teacher } from 'src/entities/teacher.entity';
import { User } from 'src/entities/user.entity';
import { TeachersService } from './teachers.service';

@Controller('api/teachers')
@ApiTags('강사 API')
export class TeachersController {
    constructor(private teachersSerice : TeachersService){}

    @UseGuards(AuthGuard('jwt'))
    @Post()
        registerTeacher(@UserDecorator()user : User , @Body() updateData):Promise<Teacher>{
            return  this.teachersSerice.registerTeacher(user,updateData);
        }
}
