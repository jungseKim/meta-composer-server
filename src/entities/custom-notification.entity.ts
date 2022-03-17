import { type } from "os";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Message } from "./message.entity";
import { Signup } from "./signup.entity";
import { User } from "./user.entity";

@Entity()
export class CustomNotification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // type: string;
  //enum?

  @Column({ type: "datetime", default: false })
  readTime: boolean;
  //nullbale

  // @Column()
  // notifiable: string;

  // @Column()
  // data: Signup | Message;

  @ManyToOne((type) => Signup, (signup) => signup.customNotifications, {
    nullable: true,
  })
  signup: Signup;

  @Column()
  signupId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne((type) => User, (user) => user.customNotifications)
  user: User;

  @Column({ name: "userId" })
  //join 칼럼명 이름바꾸기2
  userId: number;
}
