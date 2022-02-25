import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity()
export class Part extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne((type) => Lesson, (lesson) => lesson.part)
  lesson: Lesson;

  @Column()
  sequence: number;

  @Column()
  handTracking: string;

  @Column()
  audio: string;

  @Column()
  pianoEvent: string;
}
//