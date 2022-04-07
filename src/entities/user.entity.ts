
import { CustomNotification } from "./custom-notification.entity";

import { Teacher } from "./teacher.entity";

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
} from "typeorm";
import { Comment } from "./comment.entity";
import { ChatRoom } from "./chatRoom.entity";
import { Wishlist } from "./wishlist.entity";
import { Signup } from "./signup.entity";
import { Attendance } from "./attendance.entity";
import { Sheet } from "./sheet.entity";
import { Assignment } from "./assignment.entity";
import { ConcoursSignup } from "./concoursSignup.entity";
import { LessonRoom } from "./lessonRoom.entity";
import { Message } from "./message.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Payment } from "./payment.entity";

export enum ProviderType {
  FACEBOOK = "Facebook",
  INSTAGRAM = "Instagram",
  WHATSAPP = "WhatsApp",
  ETC = "etc",
}
@Entity()
@Unique(["id"])
export class User extends BaseEntity {
  @ApiProperty({ example: 1, description: "프라이머리키" })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ example: "example@naver.com", description: "유저 이메일" })
  @Column({ unique: true })
  @ApiProperty({
    example: "example@gmail.com",
    description: "이메일입니다.",
  })
  email: string;

  // @Column({ nullable: true })
  // @ApiProperty({
  //   example: "password123",
  //   description: "비밀번호, nullable ",
  // })
  // password: string;
  @ApiProperty({ example: "김정세", description: "유저닉네임" })
  @Column()
  @ApiProperty({
    example: "닉네임123",
    description: "유저 이름",
  })
  username: string;
  @ApiProperty({ example: "null", description: "nullable" })
  @Column({ nullable: true })
  @ApiProperty({
    example: "https://eager-beating.name",
    description: "유저 프로필 이미지, nullable",
  })
  profile_image: string;

  @ApiProperty({ example: "facebook", description: "소셜로그인" })
  @Column({ nullable: true })
  provider: string;

  @ApiProperty({ example: "123123123", description: "소셜로그인 아이디" })
  @Column({ unique: true })
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
  @OneToOne((type) => Teacher, (teacher) => teacher.user, {
    cascade: true,
  })
  teacher: Teacher;

  @OneToMany((type) => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany((type) => Message, (message) => message.sender, { eager: true })
  messages: Message[];
  // sender

  @OneToMany(
    (type) => CustomNotification,
    (customNotifications) => customNotifications.user,
  )
  customNotifications: CustomNotification[];

  @OneToMany((type) => Comment, (comment) => comment.user, {
    cascade: true,
  })
  comment: Comment;

  @OneToMany((type) => Comment, (comment) => comment.user, {
    cascade: true,
    eager: true,
  })
  comments: Comment[];

  @OneToMany((type) => ChatRoom, (chatRoom) => chatRoom.user, { eager: true })
  chatRooms: ChatRoom[];

  @OneToMany((type) => Wishlist, (wishlist) => wishlist.user, {
    cascade: true,
    eager: true,
  })
  wishlists: Wishlist[];
  @OneToMany((type) => Signup, (signup) => signup.user, {
    cascade: true,
    eager: true,
  })
  signups: Signup[];
  @OneToMany((type) => Attendance, (attendance) => attendance.user, {
    eager: true,
  })
  attendances: Attendance[];
  @OneToMany((type) => Sheet, (sheet) => sheet.user, { eager: true })
  sheets: Sheet[];

  @OneToMany((type) => Assignment, (assignment) => assignment.user, {
    cascade: true,
    eager: true,
  })
  assignments: Assignment[];

  @OneToMany(
    (type) => ConcoursSignup,
    (concoursSignup) => concoursSignup.user,

    { cascade: true, eager: true },
  )
  concoursSignups: ConcoursSignup[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
