import { Comment } from "src/entities/comment.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Comment)
export class CommentsRepository extends Repository<Comment> {
  async createComment(user, updateData, lessonId): Promise<Comment> {
    const comment = this.create({
      contents: updateData.contents,
      rating: updateData.rating,
      user: user.id,
      lessonId: lessonId,
    });

    await this.save(comment);

    return comment;
  }
  async getCommentById(lessonId: number, commentId: number): Promise<Comment> {
    const comment = this.createQueryBuilder("comment")
      .where("comment.lessonId = :lessonid", { lessonid: lessonId })
      .andWhere("comment.id = :commentid", { commentid: commentId })
      .getOne();

    return comment;
  }

  async updateComment(
    lessonId: number,
    commentId: number,
    user,
    updateData,
  ): Promise<any> {
    this.createQueryBuilder()
      .update(Comment)
      .set({
        contents: updateData.contents,
        rating: updateData.rating,
        user: user.id,
        lessonId: lessonId,
      })
      .where("id = :id", { id: commentId })
      .execute();
  }
}
