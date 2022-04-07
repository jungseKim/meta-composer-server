import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { ConcoursSignup } from "./concoursSignup.entity";
import { Signup } from "./signup.entity";
import { User } from "./user.entity";
@Entity()
@Unique(["id"])
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.payments, { eager: true })
  user: User;

  @Column({ unique: false })
  @ApiProperty({
    example: 1,
    description: "유저 ID값",
  })
  userId: number;

  @OneToOne(() => Signup, (signup) => signup.payment, {
    eager: true,
  })
  @JoinColumn()
  signup: Signup;

  @Column({ nullable: true, default: null })
  @ApiProperty({
    example: 1,
    description: "수강 등록 ID값",
  })
  signupId: number;

  @OneToOne(() => ConcoursSignup, (concoursSignup) => concoursSignup.payment, {
    eager: true,
  })
  @JoinColumn()
  concoursSignup: ConcoursSignup;

  @Column({ nullable: true, default: null })
  @ApiProperty({
    example: 1,
    description: "콩쿠르 등록 ID값",
  })
  concoursSignupId: number;

  @Column()
  @ApiProperty({
    example: "merchant_id_12345",
    description: "결제 고유 번호",
  })
  payment_number: string;
  //결제 번호  , merchant_id 임.

  @Column()
  @ApiProperty({
    example: "merchant_id_12345",
    description: "결제 고유 번호",
  })
  affiliation: string;

  @Column({ default: false })
  @ApiProperty({
    example: false,
    description: "환불 유무",
  })
  refund: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  @ApiProperty({
    example:
      "https://iniweb.inicis.com/DefaultWebApp/mall/cr/cm/mCmReceipt_head.jsp?noTid=StdpayCARDINIpayTest20220404192038705693&noMethod=1",
    description: "영수증 조회 주소",
  })
  receipt_url: string;
}
