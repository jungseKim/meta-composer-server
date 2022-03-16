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
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Teacher, (teacher) => teacher.lessons,{  onDelete: 'CASCADE',  })
  teacher: Teacher;

  @Column()
  @ApiProperty({
    example:'레슨 샘플입니다.',
    description: '레슨 소개'
  })  
  introduce: string;

  @Column({ type: 'time' })
  
  @ApiProperty({
    example:'00:30:00',
    description:'레슨의 길이이며, 시간/분/초 형식'
  })  
  length: number;

  @Column()
  @ApiProperty({
    example: '200000',
    description: '레슨의 가격'
  })  
  price: number;

  @Column({ unique: true })
  @ApiProperty({
    example:'레슨 샘플 이름입니다.',
    description:'레슨 이름'
  })  
  name: string;

  @Column({ type: 'enum', enum: LessonType })
  @ApiProperty({
    example:'Sonata',
    description:'레슨의 타입입니다.Sonata,Etudes,Waltzes,Nocturnes,Marches 중에서 선택 가능합니다. '
    
  })  
  type: LessonType;
  //enum?

  @OneToMany(() => TimeTable, (timeTable) => timeTable.lesson,{eager : true })
  timeTables: TimeTable[];

  @OneToMany(() => Part, (part) => part.lesson,{eager : true })
  parts: Part[];

  @OneToMany(() => Comment, (comment) => comment.lesson,{eager : true })
  comments: Comment[];

  @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.lesson,{eager : true })
  chatRooms: ChatRoom[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.lesson,{eager : true })
  wishlists: Wishlist[];

  @OneToMany(() => Signup, (signup) => signup.lesson,{  cascade: true})
  signups: Signup[];

  @OneToMany(() => Sheet, (sheet) => sheet.lesson,{eager : true })
  sheets: Sheet[];

  @OneToMany((type) => Assignment, (assignment) => assignment.lesson,{eager : true })
  assignments: Assignment[];

  @Column()
  @ApiProperty({
    example:'1',
    description:'레슨을 생성할 강사의 ID값 입니다.'
  })  
  teacherId: number;



  @CreateDateColumn()
  created_at: Date;

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