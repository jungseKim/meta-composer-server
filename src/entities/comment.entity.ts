import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CustomNotification } from "./custom-notification.entity";
import { Lesson } from "./lesson.entity";
import { User } from "./user.entity";

export enum Rating {
  ONE = 1,
  ONE_POINT_FIVE = 1.5,
  TWO = 2,
  TWO_POINT_FIVE = 2.5,
  THREE = 3,
  THREE_POINT_FIVE = 3.5,
  FOUR = 4,
  FOUR_POINT_FIVE = 4.5,
  FIVE = 5,
}

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.comments, { nullable: false })
  user: User;

  @ManyToOne(() => Lesson, (lesson) => lesson.comments, { cascade: true })
  lesson: Lesson;

  @Column()
  @ApiProperty({
    example: "강의가 도움이 많이 되었습니다.",
    description: "강의 후기 내용",
  })
  contents: string;

  @Column({ type: "enum", enum: Rating })
  @ApiProperty({
    example: 4.5,
    description: "강의 별점입니다. 1~5중에 0.5간격으로 선택가능",
  })
  rating: Rating;

  @Column()
  lessonId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(
    (type) => CustomNotification,
    (customNotification) => customNotification.commnet,
    { nullable: true },
  )
  customNotification: CustomNotification;
}
