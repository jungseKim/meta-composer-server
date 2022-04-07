import { ApiProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ConcoursSignup } from "./concoursSignup.entity";

@Entity()
export class Concours extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({
    example: "30000",
    description: "콩쿠르 참가비",
  })
  price: number;

  @Column({ type: "datetime" })
  @ApiProperty({
    example: "2023-05-17 14:00",
    description: "콩쿠르 참가자 모집 시작 시간",
  })
  concoursSignupStartTime: string;

  @Column({ type: "datetime" })
  @ApiProperty({
    example: "2023-05-27 23:00",
    description: "콩쿠르 참가자 모집 종료 시간",
  })
  concoursSignupFinishTime: string;

  @Column({ type: "datetime" })
  @ApiProperty({
    example: "2023-05-28 09:00",
    description: "콩쿠르 대회 시작 시간",
  })
  startTime: string;

  @Column({ type: "datetime" })
  @ApiProperty({
    example: "2023-06-03 21:00",
    description: "콩쿠르 대회 종료 시간",
  })
  finishTime: string;

  @Column({ unique: true })
  @ApiProperty({
    example: "쇼팽 콩쿠르",
    description: "콩쿠르 대회명",
  })
  title: string;

  @Column()
  @ApiProperty({
    example: "콩쿠르 합시다.",
    description: "콩쿠르 설명",
  })
  contents: string;

  @Column()
  @ApiProperty({
    example: "https://www.imgimgimg.com",
    description:
      "콩쿠르 커버 이미지 저장 주소,   요청 시에는 form 데이터로 id image 로 설정하여 이미지파일 업로드필요",
  })
  coverIMG_url: string;

  @Column()
  @ApiProperty({
    example: 9,
    description: "콩쿠르 시작하는 최소인원",
  })
  minimum_starting_people: number;

  @OneToMany(
    () => ConcoursSignup,
    (concoursSignup) => concoursSignup.concours,
    { onDelete: "CASCADE" },
  )
  concoursSignups: ConcoursSignup[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
