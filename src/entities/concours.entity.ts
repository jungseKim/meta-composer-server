import { ApiProperty } from '@nestjs/swagger';
import {
    BaseEntity,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { ConcoursSignup } from './concoursSignup.entity';

  @Entity()
  export class Concours extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
   
    @Column()
    @ApiProperty({
      example: '30000',
      description: '콩쿠르 참가비'
    })  
    price:number;

    @Column({ type: 'datetime' })
    @ApiProperty({
      example: '2023-05-17 14:00',
      description: '콩쿠르 참가자 모집 시작 시간'
    })  
    concoursSignupStartTime: number;
   
    @Column({ type: 'datetime' })
    @ApiProperty({
      example: '2023-05-27 23:00',
      description: '콩쿠르 참가자 모집 종료 시간'
    })  
    concoursSignupFinishTime: number;
    
    @Column({ type: 'datetime' })
    @ApiProperty({
      example: '2023-05-28 09:00',
      description: '콩쿠르 대회 시작 시간'
    })  
    startTime: number;
   
    @Column({ type: 'datetime' })
    @ApiProperty({
      example: '2023-06-03 21:00',
      description: '콩쿠르 대회 종료 시간'
    })  
    finishTime: number;
  
    @Column()
    @ApiProperty({
      example: '쇼팽 콩쿠르',
      description: '콩쿠르 대회명'
    })  
    title: string;
      
    @Column()
    @ApiProperty({
      example: '콩쿠르 합시다.',
      description: '콩쿠르 설명'
    })  
    contents: string;
    
    @OneToMany((type) => ConcoursSignup, (concoursSignup) => concoursSignup.concours, {  onDelete: 'CASCADE',})
    concoursSignup: ConcoursSignup;

    
  }
  