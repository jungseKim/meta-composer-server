import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Lesson } from "./lesson.entity";
import { User } from "./user.entity";

@Entity()
export class ViewCount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne((type) => User, (user) => user.wishlists, {
    onDelete: "CASCADE",
  })
  user: User;
  //ddtest
  @ManyToOne((type) => Lesson, (lesson) => lesson.wishlists, {
    onDelete: "CASCADE",
  })
  lesson: Lesson;

  @Column()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: "유저의 ID값, 토큰기반으로 자동저장",
  })
  userId: number;

  @Column()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: "조회한 레슨의ID값",
  })
  lessonId: number;

  @Column()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: "레슨 조회한 횟수",
  })
  viewCount: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
