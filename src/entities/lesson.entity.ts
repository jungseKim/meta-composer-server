import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Assignment } from "./assignment.entity";
import { ChatRoom } from "./chatRoom.entity";
import { Comment } from "./comment.entity";
import { Part } from "./part.entity";
import { SearchHistory } from "./searchHistory.entiry";
import { Sheet } from "./sheet.entity";
import { Signup } from "./signup.entity";
import { Teacher } from "./teacher.entity";
import { TimeTable } from "./timeTable.entity";
import { Wishlist } from "./wishlist.entity";

export enum LessonType {
  SONATA = "Sonata",
  ETUDES = "Etudes",
  WALTZES = "Waltzes",
  NOCTURNES = "Nocturnes",
  MARCHES = "Marches",
}

export enum Difficulty {
  BIGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

@Entity()
@Unique(["id"])
export class Lesson extends BaseEntity {
  @ApiProperty({ example: 1, description: "프라이머리키" })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Teacher, (teacher) => teacher.lessons, {
    onDelete: "CASCADE",
  })
  teacher: Promise<Teacher>;

  @Column("longtext")
  @ApiProperty({
    example: "레슨 샘플입니다.",
    description: "레슨 소개",
  })
  introduce: string;

  @Column({ type: "time" })
  @ApiProperty({
    example: "00:30:00",
    description: "레슨의 길이이며, 시간/분/초 형식",
  })
  length: number;

  @Column()
  @ApiProperty({
    example: "200000",
    description: "레슨의 가격",
  })
  price: number;

  @Column("longtext")
  @ApiProperty({
    example: "https://....",
    description: "이미지 주소",
  })
  imageURL: string;

  @Column({ unique: true })
  @ApiProperty({
    example: "레슨 샘플 이름입니다.",
    description: "레슨 이름",
  })
  name: string;

  @Column({ type: "enum", enum: LessonType })
  @ApiProperty({
    example: LessonType.SONATA,
    description:
      "레슨의 타입입니다.Sonata,Etudes,Waltzes,Nocturnes,Marches 중에서 선택 가능합니다. ",
  })
  type: LessonType;
  //enum?

  @OneToMany(() => TimeTable, (timeTable) => timeTable.lesson, {
    cascade: true,
    // eager: true,
  })
  timeTables: TimeTable[];

  @OneToMany(() => Part, (part) => part.lesson, {
    cascade: true,
    // eager: true
  })
  parts: Part[];

  @OneToMany(() => Comment, (comment) => comment.lesson, {
    cascade: true,
    eager: true,
  })
  comments: Comment[];

  @OneToMany((type) => ChatRoom, (chatRoom) => chatRoom.lesson, {
    eager: true,
  })
  chatRooms: ChatRoom[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.lesson, {
    cascade: true,
    // eager: true,
  })
  wishlists: Wishlist[];

  @OneToMany(() => Signup, (signup) => signup.lesson, {
    cascade: true,
  })
  signups: Signup[];

  @OneToMany(() => Sheet, (sheet) => sheet.lesson, {
    cascade: true,
    // eager: true,
  })
  sheets: Sheet[];

  @OneToMany((type) => Assignment, (assignment) => assignment.lesson, {
    cascade: true,
    // eager: true,
  })
  assignments: Assignment[];

  @Column()
  @ApiProperty({
    example: "1",
    description: "레슨을 생성할 강사의 ID값 입니다.",
  })
  teacherId: number;

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

  @OneToMany(() => SearchHistory, (searchHistory) => searchHistory.lesson, {
    cascade: true,
  })
  searchHistories: SearchHistory[];

  @Column({ type: "enum", enum: Difficulty })
  @ApiProperty({
    example: Difficulty.ADVANCED,
    description: "레슨의 난이도입니다 beginner intermediate advanced 선택가능",
  })
  difficulty: Difficulty;

  @Column("longtext", { nullable: true })
  @ApiProperty({
    example:
      "이런걸 배워요 이런걸 배워요 이런걸 배워요 이런걸 배워요 이런걸 배워요 .",
    description: "이런걸 배워요 이런걸 배워요  ",
  })
  weLearnThis: string;
  //enum?

  @Column({ nullable: true })
  @ApiProperty({
    example: "확인해 주세요 확인해 주세요확인해 주세요 확인해 주세요 .",
    description: "확인해 주세요 확인해 주세요  ",
  })
  checkPlease: string;
}
// number will be converted into integer, string into varchar, boolean into bool, etc. But you can use any column type your database supports by explicitly specifying a column type into the @Column decorator.  from typeorm.io

// @Entity()
// class Book extends BaseEntity {
//     @ManyToOne(() => Author, (author) => author.books, {
//         onDelete: 'CASCADE',
//     })
//     public author?: Author
// }

// @Entity()
// class Author extends BaseEntity {
//     @OneToMany(() => Book, (book) => book.author, {
//         cascade: true,
//     })
//     public books: Book[];
// }
