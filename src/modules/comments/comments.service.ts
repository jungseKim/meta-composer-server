import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { CommentsRepository } from './comments.repository';

@Injectable()
export class CommentsService {

   constructor(
       @InjectRepository(CommentsRepository) private commentsRepository : CommentsRepository,
    ){}

    async getAllComments():Promise<Comment[]>{
        return this.commentsRepository.find();
    }

    async createComment(user, updateData,lessonId,):Promise<Comment>{
        return this.commentsRepository.createComment(user,updateData,lessonId);
    }
   
    async getCommentById(lessonId : number,commentId:number):Promise<Comment>{
        return this.commentsRepository.getCommentById(lessonId,commentId);
    }
    
  async updateComment(lessonId: number,commentId:number,user,updateData):Promise<Comment>{
    return this.commentsRepository.updateComment(lessonId,commentId,user,updateData)
  }
    

}
