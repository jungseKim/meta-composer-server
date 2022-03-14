import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
import { Concours } from './concours.entity';
import { User } from './user.entity';

  @Entity()
  export class ConcoursSignup extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
      
    @ManyToOne((type) => Concours, (concours) => concours.concoursSignup,{  onDelete: 'CASCADE',  })
    concours: Concours;
     
    @ManyToOne((type) => User, (user) => user.concoursSignup,{  onDelete: 'CASCADE',  })
    user: User;

    @Column()
    concoursId:number;

    @Column()
    userId:number;

    @Column()
    youtubeURL : string;

    @Column()
    merchant_uid : string;
    //구매고유id

    @Column({ type: 'datetime' })
    participated_date : string;
    //참가한 날짜

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  