import { User } from './user.entity';
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
export class Teacher extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  career: string;

  @Column()
  introduce: string;

  @Column()
  self_video: string;

  @OneToOne((type) => User, (user) => user.teacher)
  @JoinColumn()
  user: User;
}
