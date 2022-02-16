import { Teacher } from './teacher.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['id'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;


  @Column()
  username: string;

  @Column()
  provider: string;

  @Column('varchar', {
    unique: true,
    length: 100,
    nullable: true,
  })
  provider_id: number;

  @OneToOne((type) => Teacher, (teacher) => teacher.user)
  teacher: Teacher;
}
