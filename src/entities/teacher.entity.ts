import { User } from "./user.entity";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Lesson } from "./lesson.entity";
// import { Attendance } from "./attendance.entity";
import { ApiProperty } from "@nestjs/swagger";
import { isString } from "util";
import { isStringObject } from "util/types";
import { Signuptimetable } from "./signuptimetable.entity";

@Entity()
@Unique(["id"])
export class Teacher extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => User, (user) => user.teacher, { eager: true })
  @JoinColumn()
  user: User;

  @Column()
  @ApiProperty({
    example: "Berklee College of Music",
    description: "강사의 경력",
  })
  career: string;
  @Column()
  @ApiProperty({
    example: "Glad to meet you",
    description: "강사 자기소개",
  })
  introduce: string;
  @Column()
  @ApiProperty({
    example: "http://localhost:3000",
    description: "자기소개 동영상",
  })
  self_video: string;

  @OneToMany((type) => Lesson, (lesson) => lesson.teacher, {
    onDelete: "CASCADE",
  })
  lessons: Promise<Lesson[]>;
  @OneToMany(
    (type) => Signuptimetable,
    (signuptimetable) => signuptimetable.teacher,
  )
  signuptimetable: Signuptimetable[];

  @Column()
  @ApiProperty({
    example: "1",
    description: "로그인후 jwt토큰을 header에 넣으면 자동으로 들어가는 유저ID",
  })
  userId: number;
}
