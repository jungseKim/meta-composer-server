import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Assignment } from "./assignment.entity";
import { Lesson } from "./lesson.entity";
import { User } from "./user.entity";
@Entity()
export class Sheet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.sheets)
  user: Promise<User>;
  @ManyToOne((type) => Lesson, (lesson) => lesson.sheets)
  lesson: Lesson;

  @Column()
  @ApiProperty({
    example: "라흐마니노프 피아노 협주곡 2번",
    description: "악보 이름입니다.",
  })
  sheetName: string;

  @Column({ type: "boolean" })
  @ApiProperty({
    example: 1,
    description:
      "악보 공개 유무입니다. 비공개시 해당 레슨의 user 만 조회가능합니다  0 => false   ,   1 => true",
  })
  isOpen: boolean;
  //0 => false   ,   1 => true

  // @ManyToOne((type) => Assignment, (assignment) => assignment.sheets)
  // assignment: Assignment;

  @Column()
  @ApiProperty({
    example: "https://www.awsawsstoredlink.com",
    description: "aws에 저장된 악보의 저장링크입니다",
  })
  storedURL: string;

  @Column()
  userId: number;

  @Column()
  @ApiProperty({
    example: 1,
    description: "악보가 사용될 레슨의 ID값입니다",
  })
  lessonId: number;

  // @Column()
  // assignmentId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
