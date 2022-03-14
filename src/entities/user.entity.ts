import { Teacher } from './teacher.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { ChatRoom } from './chatRoom.entity';
import { Wishlist } from './wishlist.entity';
import { Signup } from './signup.entity';
import { Attendance } from './attendance.entity';
import { Sheet } from './sheet.entity';
import { Assignment } from './assignment.entity';
import { ConcoursSignup } from './concoursSignup.entity';
import { LessonRoom } from './lessonRoom.entity';
import { Message } from './message.entity';

export enum ProviderType {
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  WHATSAPP = 'WhatsApp',
  ETC = 'etc',
}
@Entity()
@Unique(['id'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  email: string;
  @Column( {nullable: true})
  password: string;
  @Column()
  username: string;
  @Column({ nullable: true })
  profile_image: string;
  
  @Column({ nullable: true })
  provider: string;
  @Column({ unique: true  })
  provider_id: string;
  //
  // @Column({
  //   unique: true,
  //   nullable: true,
  // })
  // provider_id: number;
  // @Column({ nullable: true, type: 'enum', enum: ProviderType })
  // provider: ProviderType;



  @OneToOne(() => LessonRoom, (lessonRoom) => lessonRoom.user)
  lessonRoom: LessonRoom;

  @Column({ nullable: true })
  self_introduce: string;
  @OneToOne((type) => Teacher, (teacher) => teacher.user)
  teacher: Teacher;

  @OneToMany((type) => Message, (message) => message.sender)
  message: Message;
  // sender


  @OneToMany((type) => Comment, (comment) => comment.user)
  comment: Comment;


  @OneToMany((type) => ChatRoom, (chatRoom) => chatRoom.user)
  chatRoom: ChatRoom;

  @OneToMany((type) => Wishlist, (wishlist) => wishlist.user)
  wishlist: Wishlist;
  @OneToMany((type) => Signup, (signup) => signup.user)
  signup: Signup;
  @OneToMany((type) => Attendance, (attendance) => attendance.user)
  attendance: Attendance;
  @OneToMany((type) => Sheet, (sheet) => sheet.user)
  sheet: Sheet;

  @OneToMany((type) => Assignment, (assignment) => assignment.user)
  assignment: Assignment;


  @OneToMany((type) => ConcoursSignup, (concoursSignup) => concoursSignup.user,{  onDelete: 'CASCADE'  })
  concoursSignup: ConcoursSignup;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}