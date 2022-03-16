import { User } from './user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';
import { Attendance } from './attendance.entity';
import { ApiProperty } from '@nestjs/swagger';
import { isString } from 'util';
import { isStringObject } from 'util/types';

@Entity()
@Unique(['id'])
export class Teacher extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => User, (user) => user.teacher,{eager : true })
  @JoinColumn()
  user: User;

  @Column()
    @ApiProperty({
    example: 'Berklee College of Music',
    description: '강사의 경력'
  })  
  career: string;
  @Column()
  @ApiProperty({
    example: 'Glad to meet you',
    description: '강사 자기소개'
  })  
  introduce: string;
  @Column()
  @ApiProperty({
    example: 'http://localhost:3000',
    description: '자기소개 동영상'
  })  
  self_video: string;
  
  @OneToMany(() => Lesson, (lesson) => lesson.teacher, {  onDelete: 'CASCADE', eager:true})
  lessons: Lesson[];

  @OneToMany(() => Attendance, (attendance) => attendance.teacher,{eager : true })
  attendances: Attendance[];

  @Column()
  @ApiProperty({
    example: '1',
    description: '로그인후 jwt토큰을 header에 넣으면 자동으로 들어가는 유저ID'
  })  
  userId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}