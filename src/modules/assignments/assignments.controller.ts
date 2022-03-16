import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { identity } from 'rxjs';
import { UserDecorator } from 'src/decorators/user.decorator';
import { Assignment } from 'src/entities/assignment.entity';
import { User } from 'src/entities/user.entity';
import { AssignmentsService } from './assignments.service';

@Controller('api/assignments')
@ApiTags('과제 API')
export class AssignmentsController {
    constructor(private assignmentsService : AssignmentsService){}

    @Post()
    createAssignment(@Body() updatedData): Promise<Assignment>{
    return this.assignmentsService.createAssignment(updatedData);
    }

    @Delete(':id')
    deleteAssignment(@Param('id') id:number){
        return this.assignmentsService.deleteAssignment(id);
    }


    @UseGuards(AuthGuard('jwt'))
    @Get()
    getAllAssignmentbyUserId(@UserDecorator() user:User) : Promise<Assignment[]>{
        return this.assignmentsService.getAllMyAssignment(user);
    }



}
