import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity()
export class Part extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne((type) => Lesson, (lesson) => lesson.parts)
  lesson: Lesson;

  @Column()
  sequence: number;

  @Column()
  handTracking: string;

  @Column()
  audio: string;

  @Column()
  pianoEvent: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
