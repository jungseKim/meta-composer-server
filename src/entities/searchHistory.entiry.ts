import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lesson } from "./lesson.entity";
import { User } from "./user.entity";

@Entity()
export class SearchHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  searchString: string;

  @ManyToOne((type) => User, (user) => user.searchHistories, {
    onDelete: "CASCADE",
  })
  user: User;

  @ManyToOne((type) => Lesson, (lesson) => lesson.searchHistories, {
    onDelete: "CASCADE",
  })
  lesson: Lesson;

  @Column()
  lessonId: number;

  @Column()
  userId: number;
}
