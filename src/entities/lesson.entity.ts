import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Assignment } from './assignment.entity';
import { ChatRoom } from './chatRoom.entity';
import { Comment } from './comment.entity';
import { Part } from './part.entity';
import { Sheet } from './sheet.entity';
import { Signup } from './signup.entity';
import { Teacher } from './teacher.entity';
import { TimeTable } from './timeTable.entity';
import { Wishlist } from './wishlist.entity';

export enum LessonType {
  SONATA = 'Sonata',
  ETUDES = 'Etudes',
  WALTZES = 'Waltzes',
  NOCTURNES = 'Nocturnes',
  MARCHES = 'Marches',
}

@Entity()
@Unique(['id'])
export class Lesson extends BaseEntity {
  @ApiProperty({ example: 1, description: '프라이머리키' })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Teacher, (teacher) => teacher.lessons, {
    onDelete: 'CASCADE',
  })
  teacher: Teacher;

  @Column()
  @ApiProperty({
    example: '레슨 샘플입니다.',
    description: '레슨 소개',
  })
  introduce: string;

  @Column({ type: 'time' })
  @ApiProperty({
    example: '00:30:00',
    description: '레슨의 길이이며, 시간/분/초 형식',
  })
  length: number;

  @Column()
  @ApiProperty({
    example: '200000',
    description: '레슨의 가격',
  })
  price: number;

  @Column({ unique: true })
  @ApiProperty({
    example: '레슨 샘플 이름입니다.',
    description: '레슨 이름',
  })
  name: string;

  @Column({ type: 'enum', enum: LessonType })
  @ApiProperty({
    example: 'Sonata',
    description:
      '레슨의 타입입니다.Sonata,Etudes,Waltzes,Nocturnes,Marches 중에서 선택 가능합니다. ',
  })
  type: LessonType;
  //enum?

  @OneToMany((type) => TimeTable, (timeTable) => timeTable.lesson)
  timeTable: TimeTable;

  @OneToMany((type) => Part, (part) => part.lesson)
  part: Part;

  @OneToMany((type) => Comment, (comment) => comment.lesson)
  comment: Comment;

  @OneToMany((type) => ChatRoom, (chatRoom) => chatRoom.lesson, {
    eager: true,
  })
  chatRooms: ChatRoom[];

  @OneToMany((type) => Wishlist, (wishlist) => wishlist.lesson)
  wishlist: Wishlist;

  @OneToMany((type) => Signup, (signup) => signup.lesson, { cascade: true })
  signup: Signup;

  @OneToMany((type) => Sheet, (sheet) => sheet.lesson)
  sheet: Sheet;

  @OneToMany((type) => Assignment, (assignment) => assignment.lesson)
  assignment: Assignment;

  @Column()
  @ApiProperty({
    example: '1',
    description: '레슨을 생성할 강사의 ID값 입니다.',
  })
  teacherId: number;

  @ApiProperty({
    example: '2022-03-15 10:38:40.480462',
    description: '생성날짜',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    example: '2022-03-15 10:38:40.480462',
    description: '업데이트 날짜',
  })
  @UpdateDateColumn()
  updated_at: Date;
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
