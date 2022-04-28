import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TransformResponseInterceptor } from "src/common/interceptors/transformResponse.interceptor";
import { UserDecorator } from "src/decorators/user.decorator";

import { Comment } from "src/entities/comment.entity";
import { User } from "src/entities/user.entity";
import { QueryBuilder } from "typeorm";
import { CommentsService } from "./comments.service";

@Controller("api/lessons")
@ApiTags("코멘트 API")
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  @Get(":id/comments")
  @ApiOperation({
    summary: "해당레슨 코멘트 조회",
    description: "해당레슨 코멘트 조회",
  })
  @ApiResponse({
    status: 200,
    description: "해당레슨 코멘트 조회완료",
    type: Comment,
  })
  @UseInterceptors(TransformResponseInterceptor)
  getAllComments(@Param("id") lessonId: number): Promise<Comment[]> {
    return this.commentService.getAllComments(lessonId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post(":id/comments")
  @ApiOperation({ summary: "코멘트 작성", description: "코멘트 작성" })
  @ApiResponse({ status: 200, description: "코멘트 작성 완료", type: Comment })
  @ApiBody({ type: Comment })
  @UseInterceptors(TransformResponseInterceptor)
  createComment(
    @Param("id") lessonId: number,
    @UserDecorator() user: User,
    @Body() updateData: Comment,
  ): Promise<Comment> {
    return this.commentService.createComment(user, updateData, lessonId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(":id/comments/:cid")
  @ApiOperation({
    summary: "특정 코멘트 조회",
    description: "특정 코멘트를 조회한다",
  })
  @ApiResponse({ status: 200, description: "코멘트 조회 완료", type: Comment })
  @UseInterceptors(TransformResponseInterceptor)
  getCommentById(
    @Param("id") lessonId: number,
    @Param("cid") commentId: number,
  ): Promise<Comment> {
    return this.commentService.getCommentById(lessonId, commentId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(":id/comments/:cid")
  @ApiOperation({
    summary: "특정 코멘트 수정",
    description: "특정 코멘트를 수정한다",
  })
  @ApiResponse({ status: 200, description: "코멘트 수정 완료", type: Comment })
  @ApiBody({ type: Comment })
  @UseInterceptors(TransformResponseInterceptor)
  updateComment(
    @Param("id") lessonId: number,
    @Param("cid") commentId: number,
    @UserDecorator() user: User,
    @Body() updateData: Comment,
  ): Promise<Comment> {
    return this.commentService.updateComment(
      lessonId,
      commentId,
      user,
      updateData,
    );
  }
}
