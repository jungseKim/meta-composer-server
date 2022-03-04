import { LessonRoom } from 'src/entities/lessonRoom.entity';
import { Teacher } from './teacher.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Comment } from './comment.entity';
import { ChatRoom } from './chatRoom.entity';
import { Wishlist } from './wishlist.entity';
import { Signup } from './signup.entity';
import { Attendance } from './attendance.entity';
import { Sheet } from './sheet.entity';
import { Assignment } from './assignment.entity';

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

  @Column()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  profile_image: string;
  //
  @Column({ nullable: true })
  provider: string;

  @Column('varchar', {
    unique: true,
    length: 100,
    nullable: true,
  })
  provider_id: number;
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
}
