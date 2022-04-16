import { ApiProperty } from "@nestjs/swagger";
import { type } from "os";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Message } from "./message.entity";
import { Signup } from "./signup.entity";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";
@Entity()
export class CustomNotification extends BaseEntity {
  @ApiProperty({ example: 1, description: "프라이머리키" })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: true, description: "읽으면 날짜  default false" })
  @Column({ type: "datetime", default: false })
  readTime: string | boolean;

  @Column()
  type: "commnet" | "signup" | "classStart";

  @Column()
  typeId: number;

  @Column()
  content: string;

  @Column({ nullable: true })
  url: string;

  @ApiProperty({
    example: "2022-03-15 10:38:40.480462",
    description: "생성날짜",
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: "2022-03-15 10:38:40.480462",
    description: "업데이트 날짜",
  })
  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne((type) => User, (user) => user.customNotifications)
  user: User;
  @ApiProperty({ example: 1, description: "받는 유저 아이디" })
  @Column({ name: "userId" })
  //join 칼럼명 이름바꾸기2
  userId: number;
}
