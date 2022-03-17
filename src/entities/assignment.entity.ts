import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Lesson } from "./lesson.entity";
import { Sheet } from "./sheet.entity";
import { User } from "./user.entity";

@Entity()
export class Assignment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.assignments)
  user: User;

  @ManyToOne(() => Lesson, (lesson) => lesson.assignments)
  lesson: Lesson;

  @Column({ type: "datetime" })
  @ApiProperty({
    example: "2022-03-15 10:38:40",
    description: "과제 시작 시간입니다",
  })
  startedTime: number;

  @Column({ type: "datetime" })
  @ApiProperty({
    example: "2022-03-15 12:38:40",
    description: "과제 종료 시간입니다",
  })
  endTime: number;

  @Column()
  @ApiProperty({
    example:
      "안토니오 루치오 비발디는 이탈리아 베네치아의 성직자, 작곡가이자 바이올린 연주가이다.",
    description: "과제 내용 설명입니다.",
  })
  contents: string;

  @Column()
  @ApiProperty({
    example: "사계 연습",
    description: "과제 제목 입니다.",
  })
  title: string;

  @Column({ type: "boolean" })
  @ApiProperty({
    example: true,
    description: "과제 수행 유무입니다",
  })
  isFinished: boolean;

  @Column()
  @ApiProperty({
    example: 80,
    description: "과제의 정확도 입니다.",
  })
  accuracy: number;

  @Column({ type: "time" })
  @ApiProperty({
    example: "00:30:00",
    description: "과제에 걸리는 시간입니다.",
  })
  time_length: number;

  @Column()
  @ApiProperty({
    example: "00:30:00",
    description: "과제 완료 횟수입니다.",
  })
  finished_times: number;

  //
  @OneToMany(() => Sheet, (sheet) => sheet.assignment, { eager: true })
  sheets: Sheet[];

  @Column()
  @ApiProperty({
    example: 1,
    description: "과제를 수행하는 유저의 ID값입니다",
  })
  userId: number;
  @Column()
  @ApiProperty({
    example: "00:30:00",
    description: "과제 완료 횟수입니다.",
  })
  lessonId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
