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
import { Concours } from "./concours.entity";
import { User } from "./user.entity";

@Entity()
export class ConcoursSignup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Concours, (concours) => concours.concoursSignups, {
    onDelete: "CASCADE",
  })
  concours: Concours;

  @ManyToOne((type) => User, (user) => user.concoursSignups, {
    onDelete: "CASCADE",
  })
  user: User;

  @Column()
  @ApiProperty({
    example: "1",
    description: "콩쿠르 ID",
  })
  concoursId: number;

  @Column()
  @ApiProperty({
    example: "2",
    description: "유저 ID값",
  })
  userId: number;

  @Column()
  @ApiProperty({
    example: "https://www.youtube.com",
    description: "유튜브 영상 주소",
  })
  youtubeURL: string;

  @Column()
  @ApiProperty({
    example: "merchant_12345",
    description: "콩쿠르 등록시 결제 고유 ID(조회, 취소시 사용)",
  })
  merchant_uid: string;
  //구매고유id

  @Column({ type: "datetime" })
  @ApiProperty({
    example: "2022-03-16 10:17:10",
    description: "참가한 날짜",
  })
  participated_date: string;
  //참가한 날짜

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
