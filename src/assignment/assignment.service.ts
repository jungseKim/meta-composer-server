import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssignmentRepository } from './assignment.repository';

@Injectable()
export class AssignmentService {
    constructor(
        @InjectRepository(AssignmentRepository) private assignmentRepository : AssignmentRepository
     ){}


    async createAssignment(updatedData){
        return this.assignmentRepository.createAssignment(updatedData);
    }
    
    // async getAllAssignmentbyUserId(){
    //     return this.assignmentRepository.getAllMyAssignment();
    // }
}
