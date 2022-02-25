import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Assignment } from './assignment.entity';
import { Lesson } from './lesson.entity';
import { User } from './user.entity';

@Entity()
export class Sheet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.sheet)
  user: User;

  @ManyToOne((type) => Lesson, (lesson) => lesson.sheet)
  lesson: Lesson;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'boolean' })
  isOpen: boolean;

  @ManyToOne((type) => Assignment, (assignment) => assignment.sheet)
  assignment: Assignment;

  @Column()
  storedURL: string;
}
//asd