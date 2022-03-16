import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Assignment } from 'src/entities/assignment.entity';
import { User } from 'src/entities/user.entity';
import { AssignmentsRepository } from './assignments.repository';

@Injectable()
export class AssignmentsService {
    constructor(
        @InjectRepository(AssignmentsRepository) private assignmentsRepository : AssignmentsRepository
     ){}


    async createAssignment(updatedData): Promise<Assignment>{
        return this.assignmentsRepository.createAssignment(updatedData);
    }
    
    async getAllMyAssignment(user : User): Promise<Assignment[]>{
        return this.assignmentsRepository.getAllMyAssignment(user);
    }

    async deleteAssignment(id : number):Promise<string>{
         this.assignmentsRepository.delete(id);

         return `Delete complete with id  ->> ${id}`
    }
}
