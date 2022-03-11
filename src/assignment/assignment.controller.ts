import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDecorator } from 'src/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { AssignmentService } from './assignment.service';

@Controller('api/assignment')
export class AssignmentController {
    constructor(private assignmentService : AssignmentService){}

    @Post()
    createAssignment(@Body() updatedData){
    return this.assignmentService.createAssignment(updatedData);
    }

    // @UseGuards(AuthGuard('jwt'))
    // @Get()
    // getAllAssignmentbyUserId(@UserDecorator() user:User){
    //     return this.assignmentService.getAllMyAssignment()
    // }

}
