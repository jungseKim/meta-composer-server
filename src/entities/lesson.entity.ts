import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
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

  @ManyToOne((type) => Teacher, (teacher) => teacher.lesson)
  teacher: Teacher;

  @Column()
  introduce: string;

  @Column({ type: 'time' })
  length: number;

  @Column()
  price: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'enum', enum: LessonType })
  type: LessonType;
  //enum?

  @OneToMany((type) => TimeTable, (timeTable) => timeTable.lesson)
  timeTable: TimeTable;

  @OneToMany((type) => Part, (part) => part.lesson)
  part: Part;

  @OneToMany((type) => Comment, (comment) => comment.lesson)
  comment: Comment;

  @OneToMany((type) => ChatRoom, (chatRoom) => chatRoom.lesson)
  chatRoom: ChatRoom;

  @OneToMany((type) => Wishlist, (wishlist) => wishlist.lesson)
  wishlist: Wishlist;

  @OneToMany((type) => Signup, (signup) => signup.lesson)
  signup: Signup;

  @OneToMany((type) => Sheet, (sheet) => sheet.lesson)
  sheet: Sheet;

  @OneToMany((type) => Assignment, (assignment) => assignment.lesson)
  assignment: Assignment;

  @Column()
  teacherId: number;
}
// number will be converted into integer, string into varchar, boolean into bool, etc. But you can use any column type your database supports by explicitly specifying a column type into the @Column decorator.  from typeorm.io
