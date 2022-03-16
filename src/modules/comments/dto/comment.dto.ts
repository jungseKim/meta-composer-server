import { PickType } from "@nestjs/swagger";
import { Comment } from "src/entities/comment.entity";

export class CommentDTO extends PickType(Comment, [
  "contents",
  "rating",
  "user",
  "lessonId",
] as const) {}
