import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Lesson } from './lesson.entity';
import { User } from './user.entity';

@Entity()
export class Wishlist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne((type) => User, (user) => user.wishlist)
  user: User;
//ddtest
  @ManyToOne((type) => Lesson, (lesson) => lesson.wishlist)
  lesson: Lesson;


  @Column()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: '유저의 ID값, 토큰기반으로 자동저장'
  }) 
  userId : number

  @Column()
  @IsInt()
  @ApiProperty({
    example: 1,
    description: 'WishList에 등록할 레슨의ID값'
  }) 
  lessonId : number

}