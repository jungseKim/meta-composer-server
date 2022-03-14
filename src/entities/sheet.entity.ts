import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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
  sheetName: string;

  @Column({ type: 'boolean' })
  isOpen: boolean;
  //0 => false   ,   1 => true

  @ManyToOne((type) => Assignment, (assignment) => assignment.sheet)
  assignment: Assignment;

  @Column()
  storedURL: string;

  @Column()
  userId: number

  @Column()
  lessonId: number

  @Column()
  assignmentId: number

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}