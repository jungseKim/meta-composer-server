import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "src/entities/comment.entity";
import { User } from "src/entities/user.entity";
import { CommentsRepository } from "./comments.repository";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsRepository)
    private commentsRepository: CommentsRepository,
  ) {}

  async getAllComments(lessonId: number): Promise<Comment[]> {
    return this.commentsRepository.find({ lessonId: lessonId });
  }

  async createComment(
    user: User,
    updateData: Comment,
    lessonId: number,
  ): Promise<Comment> {
    return this.commentsRepository.createComment(user, updateData, lessonId);
  }

  async getCommentById(lessonId: number, commentId: number): Promise<Comment> {
    return this.commentsRepository.getCommentById(lessonId, commentId);
  }

  async updateComment(
    lessonId: number,
    commentId: number,
    user: User,
    updateData: Comment,
  ): Promise<Comment> {
    return this.commentsRepository.updateComment(
      lessonId,
      commentId,
      user,
      updateData,
    );
  }
}
